import { NextFunction, Request, Response } from 'express'
import { PlaylistModel } from '../models/playlistModel'

export const isUserPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    const playlistId = req.params.id

    try {
        const playlist = await PlaylistModel.findOne({ user: req.user.id, _id: playlistId })
        if (!playlist) return res.status(404).json({ message: 'You are not not allowed to edit this playlist!' })
        next()
    } catch (e) {
        res.status(500).json({ message: e })
    }
}
