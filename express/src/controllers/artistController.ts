import { Request, Response } from 'express'
import { zParse } from '../utils/zParse'
import { artistSchema } from '../schemas/artistSchema'
import { Base64 } from 'js-base64'
import tryCatch from '../utils/tryCatch'
import { songService } from '../services/songService'

export const artistList = tryCatch(async (req: Request, res: Response) => {
    const list = await songService.getAllArtists()
    if (!list) return res.status(400).json({ message: 'Artist not found' })
    res.json(list)
})

export const artistRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(artistSchema.retrieve, req)
    const { artist: artistData } = params
    const artist = decodeURIComponent(Base64.atob(artistData))
    const list = await songService.getSongByArtist(artist) // case sensitive
    if (!list.length) return res.status(400).json({ message: 'Artist Songs not found' })
    res.json({ artist, songs: list })
})
