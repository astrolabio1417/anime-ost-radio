import { Router } from 'express'
import { showRetrieve, showList } from '../controllers/showController'

const showRoutes = Router()

showRoutes.get('/api/shows', showList)
showRoutes.get('/api/shows/:show', showRetrieve)

export default showRoutes
