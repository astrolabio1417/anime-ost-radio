import { NextFunction, Request, Response } from 'express'
import { PlaylistModel } from '../models/playlistModel'
import tryCatch from '../helpers/tryCatch'

export const isUserPlaylist = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const playlistId = req.params.id
    const playlist = await PlaylistModel.findOne({ user: req.user.id, _id: playlistId })
    if (!playlist) return res.status(404).json({ message: 'You are not not allowed to edit this playlist!' })
    next()
})
