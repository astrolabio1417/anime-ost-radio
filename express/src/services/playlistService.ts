import { MongooseObjectId } from './../interfaces/MongooseInterface'
import { PlaylistDocument, PlaylistI } from '../interfaces/PlaylistInterface'
import { PlaylistModel } from './../models/playlistModel'
import { FilterQuery, PaginateOptions } from 'mongoose'

async function getPlaylists(query: FilterQuery<PlaylistDocument>, options: PaginateOptions) {
    const { sort, limit, page, ...otherOptions } = options
    const { title, user, ...otherQuery } = query ?? {}

    const opts = {
        populate: ['user', 'songs'],
        limit: limit ?? 10,
        sort: sort ?? { timestamp: 1 },
        page: page ?? 1,
        ...otherOptions,
    }
    const dbQuery = {
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(user && { user: user }),
        ...otherQuery,
    }
    const playlists = await PlaylistModel.paginate(dbQuery, opts)
    return playlists
}

async function createPlaylist(playlist: PlaylistI) {
    const newPlaylist = await PlaylistModel.create(playlist)
    return await newPlaylist.populate('user')
}

async function updatePlaylist(playlistId: MongooseObjectId, playlist: Partial<PlaylistI>) {
    const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
        { _id: playlistId },
        { $set: { ...playlist } },
        { new: true },
    )
    if (!updatedPlaylist) return null
    return (updatedPlaylist as any)._doc as PlaylistDocument // mongoose typing dabest.
}

async function deletePlaylist(playlistId: MongooseObjectId, userId: MongooseObjectId) {
    const playlist = await PlaylistModel.deleteOne({ _id: playlistId, user: userId })
    return playlist.deletedCount !== 0
}

async function addSongToPlaylist(playlistId: MongooseObjectId, songId: MongooseObjectId) {
    const playlist = await PlaylistModel.findOneAndUpdate(
        { _id: playlistId, songs: { $ne: songId } },
        { $push: { songs: songId } },
        { new: true },
    )
    if (!playlist) return null
    return (playlist as any)._doc as PlaylistDocument
}

async function removeSongFromPlaylist(playlistId: MongooseObjectId, songId: MongooseObjectId) {
    const playlist = await PlaylistModel.findOneAndUpdate(
        { _id: playlistId, songs: { $eq: songId } },
        { $pull: { songs: songId } },
        { new: true },
    )
    if (!playlist) return null
    return (playlist as any)._doc as PlaylistDocument
}

const playlistService = {
    getPlaylists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
}

export { playlistService }
