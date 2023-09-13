import { Application } from 'express'
import {
    PlaylistGet,
    playlistAddSong,
    playlistCreate,
    playlistRemoveSong,
    playlistUpdate,
    playlistsGet,
} from '../controllers/playlistController'
import { verifyToken } from '../middlewares/authJwt'

const userPlaylistRoutes = (app: Application) => {
    app.get('/api/playlists/', playlistsGet)
    app.post('/api/playlists/', [verifyToken], playlistCreate)
    app.get('/api/playlists/:id', PlaylistGet)
    app.put('/api/playlists/:id/', [verifyToken], playlistUpdate)
    app.put('/api/playlists/:id/songs/:songId', [verifyToken], playlistAddSong)
    app.delete('/api/playlists/:id/songs/:songId', [verifyToken], playlistRemoveSong)
}

export default userPlaylistRoutes
