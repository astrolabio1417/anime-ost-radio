import { Application } from 'express'
import { songDetail, songDownVote, songList, songQueueList, songUpVote } from '../controllers/songController'
import { authUserToken, isAuthenticated } from '../middlewares/authJwt'

const songRoutes = (app: Application) => {
    app.get('/api/songs', songList)
    app.get('/api/queue', songQueueList)
    app.get('/api/songs/:id', songDetail)
    app.put('/api/songs/:id/vote', [authUserToken, isAuthenticated], songUpVote)
    app.delete('/api/songs/:id/vote', [authUserToken, isAuthenticated], songDownVote)
}

export default songRoutes
