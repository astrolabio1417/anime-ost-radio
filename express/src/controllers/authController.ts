import { ROLES_DICT } from './../models/roleModel'
import { Request, Response } from 'express'
import { zParse } from '../utils/zParse'
import { authSchema } from '../schemas/authSchema'
import tryCatch from '../utils/tryCatch'
import { authService } from '../services/authService'

export const signUp = tryCatch(async (req: Request, res: Response) => {
    const { body } = await zParse(authSchema.signUp, req)
    const { username, email, password, roles } = body
    const selectedRoles = req.user.isAdmin ? roles : [ROLES_DICT.USER]
    await authService.signUp(username, email, password, selectedRoles)
    res.json({ message: 'User was registered successfully!' })
})

export const signIn = tryCatch(async (req: Request, res: Response) => {
    const { body } = await zParse(authSchema.signIn, req)
    const { username, password } = body
    const { user, token } = await authService.signIn(username, password)
    req.session = { ...req.session, token }
    res.json({ ...user, token, message: 'You have been signed in!' })
})

export const signOut = tryCatch(async (req: Request, res: Response) => {
    req.session = undefined
    return res.send({ message: "You've been signed out!" })
})

export const currentUser = tryCatch(async (req: Request, res: Response) => {
    return res.json(await authService.getUser(req.user.id))
})
