import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel'
import RoleModel from '../models/roleModel'
import generateAnonymous from '../helpers/generateAnonymous'

export const authUserToken = (req: Request, res: Response, next: NextFunction) => {
    const tokenFromAuth = req.headers?.authorization
    const token = req.session?.token ?? tokenFromAuth

    if (!token) {
        req.user = generateAnonymous()
        return next()
    }

    if (!process.env.JWT_SECRET) return res.json(500).json({ message: 'JWT_SECRET is not defined' })

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET) as UserJwtPayloadI
        req.user = { ...user, isAuthenticated: true }
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
        const user = await UserModel.findById(req.user.id)
        const roles = await RoleModel.find({ _id: { $in: user?.roles } })
        if (!roles.find(role => role.name === 'admin')) return res.status(403).json({ message: 'Unauthorized User' })
        next()
    } catch (e) {
        res.status(500).json({ message: e })
    }
}
