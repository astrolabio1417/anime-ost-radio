import { Application } from 'express'
import { artistSongs, artistsGet } from '../controllers/songController'

const artistRoutes = (app: Application) => {
    app.get('/api/artists', artistsGet)
    app.get('/api/artists/:artist', artistSongs)
}

export default artistRoutes
