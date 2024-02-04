import { Request, Response } from 'express'
import { queue } from '../queue'

export const streamPause = async (_: Request, res: Response) => {
    queue.pause()
    res.json({ isPlaying: queue.isPlaying })
}

export const streamPlay = async (_: Request, res: Response) => {
    if (!queue.isPlaying) await queue.play()
    res.json({ isPlaying: queue.isPlaying })
}
