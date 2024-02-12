import { Router } from 'express'
import {
    playlistRetrieve,
    playlistAddSong,
    playlistCreate,
    playlistDelete,
    playlistRemoveSong,
    playlistUpdate,
    playlistList,
} from '../controllers/playlistController'
import { isAuthenticated } from '../middlewares/authJwt'
import { isUserPlaylist } from '../middlewares/authUserPlaylist'
import upload from '../middlewares/upload'
import { createPlaylistParser } from '../middlewares/createPlaylistParser'

const playlistRouter = Router()

const playlistFields = [
    { name: 'cover', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]

playlistRouter.get('/api/playlists/', playlistList)
playlistRouter.post(
    '/api/playlists/',
    [isAuthenticated, upload.fields(playlistFields), createPlaylistParser],
    playlistCreate,
)
playlistRouter.get('/api/playlists/:id', playlistRetrieve)
playlistRouter.delete('/api/playlists/:id', [isAuthenticated, isUserPlaylist], playlistDelete)
playlistRouter.put(
    '/api/playlists/:id/',
    [isAuthenticated, isUserPlaylist, upload.fields(playlistFields), createPlaylistParser],
    playlistUpdate,
)
playlistRouter.put('/api/playlists/:id/songs/:songId', [isAuthenticated, isUserPlaylist], playlistAddSong)
playlistRouter.delete('/api/playlists/:id/songs/:songId', [isAuthenticated, isUserPlaylist], playlistRemoveSong)

export default playlistRouter
