import { Request, Response } from 'express'
import SongModel from '../models/songModel'
import { zParse } from '../helpers/zParse'
import { artistSchema } from '../schemas/artistSchema'
import { Base64 } from 'js-base64'
import tryCatch from '../helpers/tryCatch'

export const artistList = tryCatch(async (req: Request, res: Response) => {
    const list = await SongModel.find().distinct('artist')
    if (!list) return res.status(400).json({ message: 'Artist not found' })
    res.json(list)
})

export const artistRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(artistSchema.retrieve, req)
    const { artist: artistData } = params
    const artist = decodeURIComponent(Base64.atob(artistData))
    const list = await SongModel.find({ artist: artist }) // case sensitive
    if (!list.length) return res.status(400).json({ message: 'Artist Songs not found' })
    res.json({ artist, songs: list })
})
