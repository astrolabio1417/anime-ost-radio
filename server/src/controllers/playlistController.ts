import { Request, Response } from 'express'
import { PlaylistModel } from '../models/playlistModel'
import SongModel from '../models/songModel'

export const playlistsGet = async (req: Request, res: Response) => {
    const { limit, page, sort, title, user } = req.query
    const dbQuery = {
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(user && { user: user }),
    }
    const options = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 30,
        sort: sort ? sort : { timestamp: 1 },
    }

    PlaylistModel.paginate(dbQuery, options)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            console.error(e)
            res.status(500).json({ message: e })
        })
}

export const playlistCreate = async (req: Request, res: Response) => {
    if (!req.body.title) return res.status(400).json({ message: 'Title is required!' })
    const { title, image } = req.body ?? {}

    try {
        const playlist = await PlaylistModel.create({
            title: title,
            user: req.user.id,
            image: { cover: image?.cover, thumbnail: image?.thumbnail },
            songs: [],
        })
        res.status(201).json({ message: 'Playlist Created', playlist })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}

export const PlaylistGet = async (req: Request, res: Response) => {
    try {
        const playlist = await PlaylistModel.findOne({ _id: req.params.id }).populate('songs').populate('user')
        res.json(playlist)
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}

export const playlistUpdate = async (req: Request, res: Response) => {
    const { title, image } = req.body ?? {}
    const { cover, thumbnail } = image ?? {}

    try {
        const playlist = await PlaylistModel.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    ...(title ? { title } : {}),
                    ...(image ? { image: { cover, thumbnail } } : {}),
                },
            },
        )
        res.json(playlist)
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}

export const playlistAddSong = async (req: Request, res: Response) => {
    try {
        const song = await SongModel.findById(req.params.songId)
        if (!song) return res.status(404).json({ message: 'Song not found!' })
        const playlist = await PlaylistModel.updateOne(
            { _id: req.params.id, songs: { $ne: req.params.songId } },
            { $push: { songs: song._id } },
        )
        res.json({
            message: playlist.modifiedCount === 0 ? 'Song already in playlist' : 'Song added to playlist',
            song,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}

export const playlistRemoveSong = async (req: Request, res: Response) => {
    try {
        const playlist = await PlaylistModel.updateOne(
            { _id: req.params.id, songs: { $eq: req.params.songId } },
            { $pull: { songs: req.params.songId } },
        )
        res.json({
            message: playlist.modifiedCount === 0 ? 'Song not in playlist' : 'Song has been removed from the playlist',
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}
