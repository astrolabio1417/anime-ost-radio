import { FilterQuery, PaginateOptions } from 'mongoose'
import { SongDocument } from '../interfaces/SongInterface'
import SongModel from '../models/songModel'
import { MongooseObjectId } from '../interfaces/MongooseInterface'

async function getSongs(query: FilterQuery<SongDocument>, options: PaginateOptions) {
    const { name, artist, show, ...otherQuery } = query
    const { page, limit, sort, ...otherOptions } = options
    const dbQuery = {
        ...(name?.length && { name: { $regex: name, $options: 'i' } }),
        ...(artist?.length && { artist: { $regex: artist, $options: 'i' } }),
        ...(show?.length && { show: { $regex: show, $options: 'i' } }),
        ...otherQuery,
    }
    const opts = {
        page: page ?? 1,
        limit: limit ?? 10,
        sort: sort ?? { timestamp: 1 },
        ...otherOptions,
    }

    const result = await SongModel.paginate(dbQuery, opts)
    return result
}

async function getAllArtists(): Promise<SongDocument[] | undefined> {
    return await SongModel.find().distinct('artist')
}

async function getSongByArtist(artist: string) {
    return await SongModel.find({ artist })
}

async function getSongShows() {
    return await SongModel.find().distinct('show')
}

async function getSongsByShow(show: string) {
    const list = await SongModel.find({ show }) // case sensitive
    return list
}

async function voteSong(songId: MongooseObjectId, userId: MongooseObjectId) {
    const query = { _id: songId, 'vote.list': { $ne: userId } }
    const song = await SongModel.findOne(query)

    if (!song) return true

    const firstVote = !song?.vote?.total
    const songUpdate = await SongModel.updateOne(query, {
        ...(firstVote ? { 'vote.timestamp': Date.now() } : {}),
        $inc: { 'vote.total': 1 },
        $push: { 'vote.list': userId },
    })

    return !!songUpdate.modifiedCount
}

async function unVoteSong(songId: MongooseObjectId, userId: MongooseObjectId) {
    const query = { _id: songId, 'vote.list': { $eq: userId } }
    const song = await SongModel.findOne(query)

    if (!song) return true

    const isLastVote = song?.vote?.total === 1
    const songUpdate = await SongModel.updateOne(query, {
        $pull: { 'vote.list': userId },
        $inc: { 'vote.total': -1 },
        ...(isLastVote ? { $unset: { 'vote.timestamp': true } } : {}),
    })

    return !!songUpdate.modifiedCount
}

const songService = {
    getSongs,
    getAllArtists,
    getSongByArtist,
    getSongShows,
    getSongsByShow,
    voteSong,
    unVoteSong,
}

export { songService }
