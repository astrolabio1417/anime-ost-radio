import { Application } from 'express'
import { scrapeSongs, songDetail, songDownVote, songList, randomSong, songQueueList, songUpVote } from '../controllers/songController'
import { authUserToken, isAuthenticated } from '../middlewares/authJwt'

const songRoutes = (app: Application) => {
    app.get('/api/songs', songList)
    app.get('/api/queue', songQueueList)
    app.get('/api/songs/:id', songDetail)
    app.put('/api/songs/:id/vote', [authUserToken, isAuthenticated], songUpVote)
    app.delete('/api/songs/:id/vote', [authUserToken, isAuthenticated], songDownVote)
    app.get('/api/scrape/', scrapeSongs)
    app.get('/api/random/', randomSong)
}

export default songRoutes
