import { Application, NextFunction, Request, Response } from 'express'
import {
    PlaylistGet,
    playlistAddSong,
    playlistCreate,
    playlistDelete,
    playlistRemoveSong,
    playlistUpdate,
    playlistValidate,
    playlistsGet,
} from '../controllers/playlistController'
import { authUserToken, isAuthenticated } from '../middlewares/authJwt'
import { isUserPlaylist } from '../middlewares/authUserPlaylist'
import upload, { IExpressMulerFile } from '../middlewares/upload'
import checkValidationError from '../middlewares/checkValidationError'

const playlistFields = [
    { name: 'cover', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]

const playlistUploadToBody = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: IExpressMulerFile[] | null | undefined }
    req.body.cover = req.body.cover ?? files?.cover?.[0]?.location
    req.body.thumbnail = req.body.thumbnail ?? files?.thumbnail?.[0]?.location
    next()
}

const userPlaylistRoutes = (app: Application) => {
    app.get('/api/playlists/', playlistsGet)
    app.post(
        '/api/playlists/',
        [
            authUserToken,
            isAuthenticated,
            upload.fields(playlistFields),
            playlistUploadToBody,
            ...playlistValidate('create'),
            checkValidationError,
        ],
        playlistCreate,
    )
    app.delete('/api/playlists/:id', [authUserToken, isAuthenticated, isUserPlaylist], playlistDelete)
    app.get('/api/playlists/:id', PlaylistGet)
    app.put(
        '/api/playlists/:id/',
        [
            authUserToken,
            isAuthenticated,
            isUserPlaylist,
            upload.fields(playlistFields),
            playlistUploadToBody,
            ...playlistValidate('create'),
            checkValidationError,
        ],
        playlistUpdate,
    )
    app.put('/api/playlists/:id/songs/:songId', [authUserToken, isAuthenticated, isUserPlaylist], playlistAddSong)
    app.delete('/api/playlists/:id/songs/:songId', [authUserToken, isAuthenticated, isUserPlaylist], playlistRemoveSong)
}

export default userPlaylistRoutes
