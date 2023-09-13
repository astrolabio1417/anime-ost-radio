import { Application } from 'express'
import { checkDuplicateEmailOrUsername, checkRolesExisted } from '../middlewares/verifySignup'
import { signOut, signUp, signIn, currentUser } from '../controllers/authController'
import { verifyToken } from '../middlewares/authJwt'

const authRoutes = (app: Application) => {
    app.post('/api/auth/signup', [checkDuplicateEmailOrUsername, checkRolesExisted], signUp)
    app.post('/api/auth/signin', signIn)
    app.post('/api/auth/signout', signOut)
    app.get('/api/auth/me', [verifyToken], currentUser)
}

export default authRoutes
