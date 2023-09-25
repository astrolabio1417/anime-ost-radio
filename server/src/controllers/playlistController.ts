import { Request, Response } from 'express'
import { PlaylistModel } from '../models/playlistModel'
import { body } from 'express-validator'

export const playlistValidate = (method: 'create') => {
    const validators = {
        create: [
            body('title', 'Title is required!').trim().escape().isLength({ min: 1, max: 100 }).trim(),
            body('cover', 'Cover is not a valid URL').trim().optional({ checkFalsy: true }).isURL(),
            body('thumbnail', 'Thumbnail is not a valid URL').trim().optional({ checkFalsy: true }).isURL(),
        ],
    }

    return validators[method] ?? []
}

export const PlaylistGet = async (req: Request, res: Response) => {
    try {
        const playlist = await PlaylistModel.findOne({ _id: req.params.id }).populate('songs').populate('user')
        res.json(playlist)
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: "Couldn't get playlist" })
    }
}

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
        populate: 'user',
    }

    try {
        const playlists = await PlaylistModel.paginate(dbQuery, options)
        res.json(playlists)
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: "Couldn't get playlists" })
    }
}

export const playlistCreate = async (req: Request, res: Response) => {
    const { title, cover, thumbnail } = req.body

    try {
        const playlist = await PlaylistModel.create({
            title: title,
            user: req.user.id,
            image: { cover, thumbnail },
            songs: [],
        })
        res.status(201).json({ message: 'Playlist Created', playlist: await playlist.populate('user') })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: "Couldn't create playlist" })
    }
}

export const playlistDelete = async (req: Request, res: Response) => {
    const data = { playlistId: req.params.id }

    try {
        const playlist = await PlaylistModel.deleteOne({ _id: req.params.id, user: req.user.id })

        if (playlist.deletedCount === 0) {
            return res.status(404).json({ message: 'Cannot delete playlist', ...data })
        }

        res.json({
            message: 'Playlist Deleted',
            ...data,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: 'Cannot delete playlist', ...data })
    }
}

export const playlistUpdate = async (req: Request, res: Response) => {
    const { title, cover, thumbnail } = req.body

    try {
        const playlist = await PlaylistModel.updateOne(
            { _id: req.params.id },
            { $set: { title, image: { cover, thumbnail } } },
        )

        if (playlist.matchedCount === 0) {
            return res.status(404).json({ message: 'Playlist not found!', playlistId: req.params.id })
        }

        res.json({
            message: 'Playlist Updated',
            playlist: await PlaylistModel.findById(req.params.id).populate('user'),
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: "Couldn't update playlist", playlistId: req.params.id })
    }
}

export const playlistAddSong = async (req: Request, res: Response) => {
    const data = { playlistId: req.params.id, songId: req.params.songId }

    try {
        const playlist = await PlaylistModel.updateOne(
            { _id: req.params.id, songs: { $ne: req.params.songId } },
            { $push: { songs: req.params.songId } },
        )

        if (playlist.matchedCount === 0) {
            return res.status(404).json({ message: 'Cannot add song to playlist, Song not found!', ...data })
        }

        res.json({
            message:
                playlist.modifiedCount === 0
                    ? 'The song is now in the playlist'
                    : 'The song has been added to the playlist',
            ...data,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: 'Cannot add song to playlist, Song not found!', ...data })
    }
}

export const playlistRemoveSong = async (req: Request, res: Response) => {
    const data = { playlistId: req.params.id, songId: req.params.songId }

    try {
        const playlist = await PlaylistModel.updateOne(
            { _id: req.params.id, songs: { $eq: req.params.songId } },
            { $pull: { songs: req.params.songId } },
        )

        if (playlist.matchedCount === 0) {
            return res.status(404).json({ message: 'Cannot remove song from playlist, Song not found', ...data })
        }

        res.json({
            message:
                playlist.modifiedCount === 0
                    ? 'The song is not in the playlist'
                    : 'The song was removed from the playlist',
            ...data,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: 'Cannot remove song from playlist, Song not found', ...data })
    }
}
