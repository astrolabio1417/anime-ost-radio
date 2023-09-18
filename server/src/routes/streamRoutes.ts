import { Application } from 'express'
import { stream, streamPause, streamPlay } from '../controllers/streamController'
import { isAdmin, authUserToken } from '../middlewares/authJwt'

const streamRoutes = (app: Application) => {
    app.get('/stream', stream)
    app.get('/api/stream/pause', [authUserToken, isAdmin], streamPause)
    app.get('/api/stream/play', [authUserToken, isAdmin], streamPlay)
}

export default streamRoutes
