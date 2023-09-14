import { Application } from 'express'
import { showSongs, showsGet } from '../controllers/songController'

const showRoutes = (app: Application) => {
    app.get('/api/shows', showsGet)
    app.get('/api/shows/:show', showSongs)
}

export default showRoutes
