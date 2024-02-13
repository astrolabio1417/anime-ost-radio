import { Request, Response } from 'express'
import { queue } from '../queue'
import tryCatch from '../utils/tryCatch'

export const streamPause = tryCatch(async (_: Request, res: Response) => {
    queue.pause()
    res.json({ isPlaying: queue.isPlaying })
})

export const streamPlay = tryCatch(async (_: Request, res: Response) => {
    if (!queue.isPlaying) await queue.play()
    res.json({ isPlaying: queue.isPlaying })
})
