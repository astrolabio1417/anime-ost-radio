import { Request, Response } from 'express'
import { PlaylistModel } from '../models/playlistModel'
import tryCatch from '../helpers/tryCatch'
import { zParse } from '../helpers/zParse'
import { playlistSchema } from '../schemas/playlistSchema'

export const playlistRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.retrieve, req)
    const playlist = await PlaylistModel.findOne({ _id: params.id }).populate('songs').populate('user')
    res.json(playlist)
})

export const playlistList = tryCatch(async (req: Request, res: Response) => {
    const { query } = await zParse(playlistSchema.list, req)
    const { limit, page, sort, title, user } = query

    const dbQuery = {
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(user && { user: user }),
    }
    const options = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 30,
        sort: sort ? sort : { timestamp: 1 },
        populate: ['user', 'songs'],
    }

    const playlists = await PlaylistModel.paginate(dbQuery, options)
    res.json(playlists)
})

export const playlistCreate = tryCatch(async (req: Request, res: Response) => {
    const { body } = await zParse(playlistSchema.create, req)
    const { title, cover, thumbnail } = body

    const playlist = await PlaylistModel.create({
        title: title,
        user: req.user.id,
        image: { cover, thumbnail },
        songs: [],
    })
    res.status(201).json({ message: 'Playlist Created', playlist: await playlist.populate('user') })
})

export const playlistDelete = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.retrieve, req)
    const data = { _id: params.id }

    const playlist = await PlaylistModel.deleteOne({ _id: params.id, user: req.user.id })

    if (playlist.deletedCount === 0) {
        return res.status(404).json({ message: 'Playlist not found' })
    }

    res.json({
        message: 'Playlist Deleted',
        ...data,
    })
})

export const playlistUpdate = tryCatch(async (req: Request, res: Response) => {
    const { body, params } = await zParse(playlistSchema.update, req)
    const { title, cover, thumbnail } = body
    const playlist = await PlaylistModel.updateOne({ _id: params.id }, { $set: { title, image: { cover, thumbnail } } })

    if (playlist.matchedCount === 0) {
        return res.status(404).json({ message: 'Playlist not found', playlistId: params.id })
    }

    res.json({
        message: 'Playlist Updated',
        playlist: await PlaylistModel.findById(params.id).populate('user'),
    })
})

export const playlistAddSong = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.addSong, req)
    const { id: playlistId, songId } = params
    const data = { playlistId, songId }

    const playlist = await PlaylistModel.updateOne(
        { _id: params.id, songs: { $ne: params.songId } },
        { $push: { songs: params.songId } },
    )

    if (playlist.matchedCount === 0) {
        return res.status(404).json({ message: 'Song not found', ...data })
    }

    res.json({
        message: 'The song has been added to the playlist',
        ...data,
    })
})

export const playlistRemoveSong = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.addSong, req)
    const { id: playlistId, songId } = params
    const data = { playlistId, songId }

    const playlist = await PlaylistModel.updateOne(
        { _id: params.id, songs: { $eq: params.songId } },
        { $pull: { songs: params.songId } },
    )

    if (playlist.matchedCount === 0) {
        return res.status(404).json({ message: 'Song not found', ...data })
    }

    res.json({
        message: 'The song was removed from the playlist',
        ...data,
    })
})
