import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import generateAnonymous from '../utils/generateAnonymous'
import { authService } from '../services/authService'

export const authUserOrAnonymous = async (req: Request, res: Response, next: NextFunction) => {
    const tokenFromAuth = req.headers?.authorization
    const token = req.session?.token ?? tokenFromAuth

    if (!token) {
        req.user = generateAnonymous()
        return next()
    }

    if (!process.env.JWT_SECRET) return res.json(500).json({ message: 'JWT_SECRET is not defined' })

    try {
        const userFromToken = jwt.verify(token, process.env.JWT_SECRET) as UserJwtPayloadI
        req.user = { ...userFromToken, isAuthenticated: true, isAdmin: await authService.isUserAdmin(userFromToken.id) }
    } catch (e) {
        req.user = generateAnonymous()
    }

    next()
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.isAuthenticated) return res.status(403).json({ message: 'Unauthorized' })
    next()
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user.isAuthenticated) return res.status(403).json({ message: 'Unauthorized' })
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized User' })
        next()
    } catch (e) {
        res.status(500).json({ message: e })
    }
}
