import { Router } from 'express'
import { streamPause, streamPlay } from '../controllers/streamController'
import { isAdmin } from '../middlewares/authJwt'

const streamRouter = Router()

streamRouter.get('/api/stream/pause', [isAdmin], streamPause)
streamRouter.get('/api/stream/play', [isAdmin], streamPlay)

export default streamRouter
