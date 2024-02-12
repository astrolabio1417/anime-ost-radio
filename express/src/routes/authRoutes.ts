import { signOut, signUp, signIn, currentUser } from '../controllers/authController'
import { isAuthenticated } from '../middlewares/authJwt'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/api/auth/signup', signUp)
authRouter.post('/api/auth/signin', signIn)
authRouter.post('/api/auth/signout', [isAuthenticated], signOut)
authRouter.get('/api/auth/me', [isAuthenticated], currentUser)

export default authRouter
