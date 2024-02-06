import { Application } from 'express'
import {
    PlaylistGet,
    playlistAddSong,
    playlistCreate,
    playlistDelete,
    playlistRemoveSong,
    playlistUpdate,
    playlistsGet,
} from '../controllers/playlistController'
import { authUserToken, isAuthenticated } from '../middlewares/authJwt'
import { isUserPlaylist } from '../middlewares/authUserPlaylist'
import upload from '../middlewares/upload'
import { createPlaylistParser } from '../middlewares/createPlaylistParser'
import { validateSchema } from '../middlewares/validateSchema'
import createPlaylistSchema from '../schemas/createPlaylistSchema'

const playlistFields = [
    { name: 'cover', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]

const userPlaylistRoutes = (app: Application) => {
    app.get('/api/playlists/', playlistsGet)
    app.post(
        '/api/playlists/',
        [
            authUserToken,
            isAuthenticated,
            upload.fields(playlistFields),
            createPlaylistParser,
            validateSchema(createPlaylistSchema),
        ],
        playlistCreate,
    )
    app.get('/api/playlists/:id', PlaylistGet)
    app.delete('/api/playlists/:id', [authUserToken, isAuthenticated, isUserPlaylist], playlistDelete)
    app.put(
        '/api/playlists/:id/',
        [
            authUserToken,
            isAuthenticated,
            isUserPlaylist,
            upload.fields(playlistFields),
            createPlaylistParser,
            validateSchema(createPlaylistSchema),
        ],
        playlistUpdate,
    )
    app.put('/api/playlists/:id/songs/:songId', [authUserToken, isAuthenticated, isUserPlaylist], playlistAddSong)
    app.delete('/api/playlists/:id/songs/:songId', [authUserToken, isAuthenticated, isUserPlaylist], playlistRemoveSong)
}

export default userPlaylistRoutes
