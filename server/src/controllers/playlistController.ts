import { Request, Response } from 'express'
import { PlaylistModel } from '../models/playlistModel'
import SongModel from '../models/songModel'

export const playlistsGet = async (req: Request, res: Response) => {
    try {
        const { user } = req.query ?? {}
        const playlists = await PlaylistModel.find({
            ...(user ? { user } : {}),
        })
            .populate('user')
            .populate('songs')
        res.json(playlists)
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
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
        if (playlist.modifiedCount === 0) return res.json({ message: 'Song already in playlist' })
        res.json({ message: 'Song added to playlist' })
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
        if (playlist.modifiedCount === 0) return res.json({ message: 'Song not in playlist' })
        res.json({ message: 'Song removed from playlist' })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}
