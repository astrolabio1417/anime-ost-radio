import { NextFunction, Request, Response } from 'express'
import tryCatch from '../utils/tryCatch'
import { authService } from '../services/authService'

export const isUserPlaylist = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const playlist = await authService.isUserPlaylist(req.user.id, req.params.id)
    if (!playlist) return res.status(404).json({ message: 'You are not not allowed to access this!' })
    next()
})
