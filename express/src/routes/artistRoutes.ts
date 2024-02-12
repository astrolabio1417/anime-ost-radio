import { artistRetrieve, artistList } from '../controllers/artistController'
import { Router } from 'express'

const artistRouter = Router()

artistRouter.get('/api/artists', artistList)
artistRouter.get('/api/artists/:artist', artistRetrieve)

export default artistRouter
