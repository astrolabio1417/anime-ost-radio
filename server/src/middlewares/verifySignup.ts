import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/userModel'
import { ROLES } from '../models/roleModel'

export const checkDuplicateEmailOrUsername = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email } = req.body
    if (!username || !email) res.status(400).json({ message: 'username and email is required!' })

    try {
        const userExisted = await UserModel.findOne({ username })
        if (userExisted) return res.status(400).json({ message: 'Username is already in used!' })
        const emailExisted = await UserModel.findOne({ email })
        if (emailExisted) return res.status(400).json({ message: 'Email is already in used!' })
        next()
    } catch (e) {
        return res.status(500).json({ message: e })
    }
}

export const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
    for (const role of req.body?.ROLES ?? []) {
        if (ROLES.includes(role)) continue
        return res.status(400).send({
            message: `Failed Role ${role} does not exists!`,
        })
    }

    next()
}
