import { Request, Response } from 'express'
import SongModel from '../models/songModel'

export const artistsGet = async (req: Request, res: Response) => {
    try {
        const list = await SongModel.find().distinct('artist')
        res.json(list)
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}

export const artistSongs = async (req: Request, res: Response) => {
    try {
        const artist = decodeURIComponent(atob(req.params.artist ?? ''))
        if (!artist) return res.status(400).json({ message: 'Invalid artist' })
        const list = await SongModel.find({ artist: artist }) // case sensitive
        res.json({ artist, songs: list })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}
