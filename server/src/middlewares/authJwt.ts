import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel'
import RoleModel from '../models/roleModel'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const tokenFromAuth = req.headers?.authorization
    const token = req.session?.token ?? tokenFromAuth

    if (!token) return res.status(403).json({ message: 'No token provided!' })
    if (!process.env.JWT_SECRET) return res.json(500).json({ message: 'JWT_SECRET is not defined' })

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET) as UserJwtPayloadI
        req.user = user
        next()
    } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findById(req.user.id)
        const roles = await RoleModel.find({
            _id: { $in: user?.roles },
        })
        if (roles.filter(role => role.name === 'admin')) return res.status(403).json({ message: 'Unauthorized' })
        next()
    } catch (e) {
        res.status(500).json({ message: e })
    }
}
