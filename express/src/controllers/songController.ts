import { Request, Response } from 'express'
import SongModel from '../models/songModel'
import { QUEUE_EVENTS, queue } from '../queue'
import { io } from '../..'
import { getAllanimeSongJobFunc } from '../songUpdateScheduler'
import tryCatch from '../utils/tryCatch'
import { songSchema } from '../schemas/songSchema'
import { zParse } from '../utils/zParse'
import { songService } from '../services/songService'

export const songList = tryCatch(async (req: Request, res: Response) => {
    const { query } = await zParse(songSchema.list, req)
    const { limit, page, sort, name, artist, show } = query
    const result = await songService.getSongs({ name, artist, show }, { page, limit, sort })
    res.json(result)
})

export const songQueueList = tryCatch(async (_: Request, res: Response) => {
    const list = await queue.queue()
    res.json({ list, total: list.length })
})

export const songRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(songSchema.retrieve, req)
    const song = await SongModel.findOne({ _id: params.id })
    if (!song) return res.status(400).json({ message: 'Not Found!' })
    return res.json(song)
})

export const songUpVote = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(songSchema.retrieve, req)
    const isVoted = await songService.voteSong(params.id, req.user.id)
    // send the queue list
    io.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await queue.queue(20))
    isVoted ? res.status(200).json({ message: 'Vote added' }) : res.status(400).json({ message: 'Vote already added' })
})

export const songDownVote = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(songSchema.retrieve, req)
    const isUnVoted = await songService.unVoteSong(params.id, req.user.id)
    // send the queue list
    io.emit(QUEUE_EVENTS.ON_QUEUE_CHANGE, await queue.queue(20))
    if (isUnVoted) return res.status(200).json({ message: 'Vote removed' })
    res.status(400).json({ message: 'Vote already removed' })
})

export const scrapeSongs = tryCatch(async (req: Request, res: Response) => {
    await getAllanimeSongJobFunc(1)
    return res.status(200).json({ message: 'OK' })
})
