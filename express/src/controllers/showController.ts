import { Request, Response } from 'express'
import SongModel from '../models/songModel'

export const showsGet = async (req: Request, res: Response) => {
    try {
        const list = await SongModel.find().distinct('show')
        res.json(list)
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}

export const showSongs = async (req: Request, res: Response) => {
    try {
        const show = decodeURIComponent(atob(req.params.show ?? ''))
        if (!show) return res.status(400).json({ message: 'Invalid show' })
        const list = await SongModel.find({ show: show }) // case sensitive
        res.json({
            show,
            songs: list,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}
