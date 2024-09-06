import { Router } from 'express'
import {
    scrapeSongs,
    songRetrieve,
    songDownVote,
    songList,
    songQueueList,
    songUpVote,
    songCreate,
    songDelete,
} from '../controllers/songController'
import { isAdmin } from '../middlewares/authJwt'
import upload from '../middlewares/upload'
import { createSongParser } from '../middlewares/mulerUploadParsers'

const songRouter = Router()

const songImageFields = [
    { name: 'cover', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'musicUrl', maxCount: 1 },
]

songRouter.get('/api/songs', songList)
songRouter.get('/api/queue', songQueueList)
songRouter.get('/api/songs/:id', songRetrieve)
songRouter.delete('/api/songs/:id', [isAdmin], songDelete)
songRouter.post('/api/songs/', [isAdmin, upload.fields(songImageFields), createSongParser], songCreate)
songRouter.put('/api/songs/:id/vote', [isAdmin], songUpVote)
songRouter.delete('/api/songs/:id/vote', [isAdmin], songDownVote)
songRouter.get('/api/scrape/', [isAdmin], scrapeSongs)

export default songRouter
