import { Request, Response } from 'express'
import SongModel from '../models/songModel'
import { QUEUE_EVENTS, queue } from '../queue'
import { checkObjectId } from '../helpers/checkObjectId'
import { io } from '../..'
import { getAllanimeSongJobFunc } from '../songUpdateScheduler'

export const songList = (req: Request, res: Response) => {
    const { limit, page, sort, name, artist, show } = req.query
    const dbQuery = {
        ...(name && { name: { $regex: name, $options: 'i' } }),
        ...(artist && { artist: { $regex: artist, $options: 'i' } }),
        ...(show && { show: { $regex: show, $options: 'i' } }),
    }
    const options = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 30,
        sort: sort ? sort : { timestamp: 1 },
    }

    SongModel.paginate(dbQuery, options)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            res.status(500).json({ message: e })
        })
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

export const scrapeSongs = async (req: Request, res: Response) => {
    await getAllanimeSongJobFunc(1)
    return res.status(200).json({ message: 'OK' })
}

export const randomSong = async (req: Request, res: Response) => {
    queue.playRandom()
    return res.status(200)
}
