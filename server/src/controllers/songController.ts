import { Request, Response } from 'express'
import { escapeRegex } from '../helpers/escapeRegex'
import SongModel from '../models/songModel'
import { QUEUE_EVENTS, queue } from '../queue'
import { checkObjectId } from '../helpers/checkObjectId'
import { io } from '../..'

export const songList = async (req: Request, res: Response) => {
    const { page: qPage, search } = req.query
    const limit = 30
    const page = parseInt(`${qPage}`) ?? 1
    const skip = limit * (page - 1)
    const regex = { $regex: escapeRegex(`${search}`), $options: 'i' }
    const query = { $or: [{ name: regex }, { artist: regex }, { show: regex }] }

    try {
        const list = await SongModel.find(search ? query : {})
            .limit(limit)
            .skip(skip)
            .sort({ name: 1, artist: 1, show: 1 })

        res.json({
            list,
            total: list.length,
            page,
            limit,
            hasNextPage: list.length >= limit,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}
export const songQueueList = async (_: Request, res: Response) => {
    const list = (await queue.queue()) ?? []
    res.json({
        list,
        total: list.length,
    })
}

export const songDetail = async (req: Request, res: Response) => {
    try {
        const song = await SongModel.findOne({ _id: req.params.id })
        if (!song) return res.status(400).json({ message: 'Not Found!' })
        return res.json(song)
    } catch (e) {
        console.error(e)
        return res.status(400).json({ message: e })
    }
}

export const songUpVote = async (req: Request, res: Response) => {
    const session = req.user.id

    if (!checkObjectId(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid ID',
        })
    }

    const query = { _id: req.params.id, 'vote.list': { $ne: session } }
    const song = await SongModel.findOne(query)
    if (!song) return res.status(400).json({ message: 'Vote already added' })

    const firstVote = !song?.vote?.total
    const songUpdate = await SongModel.updateOne(query, {
        ...(firstVote ? { 'vote.timestamp': Date.now() } : {}),
        $inc: { 'vote.total': 1 },
        $push: { 'vote.list': session },
    })

    // send the queue list
    io.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await queue.queue(20))
    songUpdate.modifiedCount
        ? res.status(200).json({ message: 'Vote added' })
        : res.status(400).json({ message: 'Vote already added' })
}

export const songDownVote = async (req: Request, res: Response) => {
    const session = req.user.id

    if (!checkObjectId(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid ID',
        })
    }

    const query = { _id: req.params.id, 'vote.list': { $eq: session } }
    const song = await SongModel.findOne(query)

    if (!song) return res.status(400).json({ message: 'Vote already removed' })

    const isLastVote = song?.vote?.total === 1
    const songUpdate = await SongModel.updateOne(query, {
        $pull: { 'vote.list': session },
        $inc: { 'vote.total': -1 },
        ...(isLastVote ? { $unset: { 'vote.timestamp': true } } : {}),
    })

    // send the queue list
    io.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await queue.queue(20))
    songUpdate.modifiedCount
        ? res.status(200).json({ message: 'Vote removed' })
        : res.status(400).json({ message: 'Vote already removed' })
}

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
        res.json({
            artist,
            songs: list,
        })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}

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
