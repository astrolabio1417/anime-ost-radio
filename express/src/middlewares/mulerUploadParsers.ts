import { NextFunction, Request, Response } from 'express'
import { IExpressMulerFile } from './upload'

interface IFiles {
    [fieldname: string]: IExpressMulerFile[] | null | undefined
}

export const createPlaylistParser = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as IFiles

    req.body.cover = req.body.cover ?? files?.cover?.[0]?.location
    req.body.thumbnail = req.body.thumbnail ?? files?.thumbnail?.[0]?.location

    next()
}

export const createSongParser = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as IFiles
    const cover = req.body.cover || files?.cover?.[0]?.location || null
    const thumbnail = req.body.thumbnail || files?.thumbnail?.[0]?.location || null
    req.body.image = { cover, thumbnail }
    req.body.musicUrl = req.body.musicUrl || files?.musicUrl?.[0]?.location

    next()
}
