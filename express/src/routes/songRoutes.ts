import { Router } from 'express'
import {
    scrapeSongs,
    songRetrieve,
    songDownVote,
    songList,
    songQueueList,
    songUpVote,
} from '../controllers/songController'
import { isAdmin, isAuthenticated } from '../middlewares/authJwt'

const songRouter = Router()

songRouter.get('/api/songs', songList)
songRouter.get('/api/queue', songQueueList)
songRouter.get('/api/songs/:id', songRetrieve)
songRouter.put('/api/songs/:id/vote', [isAuthenticated], songUpVote)
songRouter.delete('/api/songs/:id/vote', [isAuthenticated], songDownVote)
songRouter.get('/api/scrape/', [isAdmin], scrapeSongs)

export default songRouter
