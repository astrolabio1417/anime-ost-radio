import { Request, Response } from 'express'
import SongModel from '../models/songModel'
import { QUEUE_EVENTS, queue } from '../queue'
import { io } from '../..'
import { getAllanimeSongJobFunc } from '../songUpdateScheduler'
import tryCatch from '../helpers/tryCatch'
import { songSchema } from '../schemas/songSchema'
import { zParse } from '../helpers/zParse'

export const songList = tryCatch(async (req: Request, res: Response) => {
    const { query } = await zParse(songSchema.list, req)
    const { limit, page, sort, name, artist, show } = query

    const dbQuery = {
        ...(name?.length && { name: { $regex: name, $options: 'i' } }),
        ...(artist?.length && { artist: { $regex: artist, $options: 'i' } }),
        ...(show?.length && { show: { $regex: show, $options: 'i' } }),
    }
    const options = {
        page: page,
        limit: limit,
        sort: sort,
    }

    const result = await SongModel.paginate(dbQuery, options)
    res.json({ ...result, options, page, sort, name, artist, show, dbQuery, limit })
})

export const songQueueList = tryCatch(async (_: Request, res: Response) => {
    const list = (await queue.queue()) ?? []
    res.json({ list, total: list.length })
})

export const songRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(songSchema.retrieve, req)
    const song = await SongModel.findOne({ _id: params.id })
    if (!song) return res.status(400).json({ message: 'Not Found!' })
    return res.json(song)
})

export const songUpVote = tryCatch(async (req: Request, res: Response) => {
    const session = req.user.id
    const { params } = await zParse(songSchema.retrieve, req)
    const query = { _id: params.id, 'vote.list': { $ne: session } }
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
})

export const songDownVote = tryCatch(async (req: Request, res: Response) => {
    const session = req.user.id
    const { params } = await zParse(songSchema.retrieve, req)
    const query = { _id: params.id, 'vote.list': { $eq: session } }
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
})

export const scrapeSongs = tryCatch(async (req: Request, res: Response) => {
    await getAllanimeSongJobFunc(1)
    return res.status(200).json({ message: 'OK' })
})
