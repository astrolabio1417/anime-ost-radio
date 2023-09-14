import { Application } from 'express'
import { songDetail, songDownVote, songList, songQueueList, songUpVote } from '../controllers/songController'
import { verifyToken } from '../middlewares/authJwt'

const songRoutes = (app: Application) => {
    app.get('/api/songs', songList)
    app.get('/api/queue', songQueueList)
    app.get('/api/songs/:id', songDetail)
    app.put('/api/songs/:id/vote', [verifyToken], songUpVote)
    app.delete('/api/songs/:id/vote', [verifyToken], songDownVote)
}

export default songRoutes
