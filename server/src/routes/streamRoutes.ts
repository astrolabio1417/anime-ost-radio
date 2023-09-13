import { Application } from 'express'
import { stream, streamBroadcast, streamPause, streamPlay } from '../controllers/streamController'
import { isAdmin } from '../middlewares/authJwt'

const streamRoutes = (app: Application) => {
    app.get('/stream', stream)
    app.get('/api/stream/pause', [isAdmin], streamPause)
    app.get('/api/stream/play', [isAdmin], streamPlay)
    app.get('/api/stream/broadcast', [isAdmin], streamBroadcast)
}

export default streamRoutes
