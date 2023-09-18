import { Application } from 'express'
import {
    PlaylistGet,
    playlistAddSong,
    playlistCreate,
    playlistRemoveSong,
    playlistUpdate,
    playlistsGet,
} from '../controllers/playlistController'
import { authUserToken, isAuthenticated } from '../middlewares/authJwt'
import { isUserPlaylist } from '../middlewares/authUserPlaylist'

const userPlaylistRoutes = (app: Application) => {
    app.get('/api/playlists/', playlistsGet)
    app.post('/api/playlists/', [authUserToken, isAuthenticated], playlistCreate)
    app.get('/api/playlists/:id', PlaylistGet)
    app.put('/api/playlists/:id/', [authUserToken, isAuthenticated, isUserPlaylist], playlistUpdate)
    app.put('/api/playlists/:id/songs/:songId', [authUserToken, isAuthenticated, isUserPlaylist], playlistAddSong)
    app.delete('/api/playlists/:id/songs/:songId', [authUserToken, isAuthenticated, isUserPlaylist], playlistRemoveSong)
}

export default userPlaylistRoutes
