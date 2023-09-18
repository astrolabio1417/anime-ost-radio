import { Request, Response } from 'express'
import { queue } from '../queue'

export const stream = (req: Request, res: Response) => {
    const { id, client } = queue.addClient()
    console.log(`[server]: ${id} has been added! Total Client: ${queue.clients.size}`)

    res.set({ 'Content-Type': 'audio/mp3', 'Transfer-Encoding': 'chunked' })

    client.pipe(res)

    req.on('close', () => {
        queue.removeClient(id)
        console.log(`[server]: ${id} has been removed!`)
    })
}

export const streamPause = async (_: Request, res: Response) => {
    queue.pause()
    res.json({ isPlaying: queue.isPlaying })
}

export const streamPlay = async (_: Request, res: Response) => {
    if (!queue.isPlaying) await queue.play()
    res.json({ isPlaying: queue.isPlaying })
}
