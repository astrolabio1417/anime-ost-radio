import { Application } from 'express'
import { songDetail, songDownVote, songList, songQueueList, songUpVote } from '../controllers/songController'
import { verifyToken } from '../middlewares/authJwt'

const songRoutes = (app: Application) => {
    app.get('/api/song', songList)
    app.get('/api/queue', songQueueList)
    app.get('/api/song/:id', songDetail)
    app.put('/api/song/:id/vote', [verifyToken], songUpVote)
    app.delete('/api/song/:id/vote', [verifyToken], songDownVote)
}

export default songRoutes
