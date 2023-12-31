import { IRole, ROLES_DICT } from './../models/roleModel'
import Jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import UserModel from '../models/userModel'
import bcrypt from 'bcryptjs'
import RoleModel from '../models/roleModel'

export const signUp = async (req: Request, res: Response) => {
    const { username, email, password, roles } = req.body

    if (!username || !email || !password) {
        res.status(400).json({ message: 'username, email and password is required!' })
        return
    }

    const newUser = new UserModel({ username, email, password: bcrypt.hashSync(password, 8) })

    try {
        if (roles && req.user.isAuthenticated) {
            const user = await UserModel.findById(req.user.id).populate<{ roles: IRole[] }>('roles')
            const isAdmin = user?.roles.find(a => a.name === ROLES_DICT.ADMIN)

            if (isAdmin) {
                const modelRoles = await RoleModel.find({ name: { $in: req.body.roles } })
                newUser.roles = modelRoles.map(role => role._id)
            }
        }

        const userRole = await RoleModel.findOne({ name: 'user' })
        if (!userRole) return res.status(500).json({ message: '"user" is missing on userModel' })
        newUser.roles = [...newUser.roles, userRole._id]

        await newUser.save()
        res.json({ message: 'User was registered successfully!' })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: "Couldn't register" })
    }
}

export const signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET is not defined' })
    if (!password) return res.status(400).json({ message: 'Password is Required!' })

    try {
        const user = await UserModel.findOne({ username }).populate('roles').select('+password')
        if (!user) return res.status(404).json({ message: 'User Not found!' })
        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid Password' })
        const token = Jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400 * 30, // 30 days
        })
        req.session = { ...req.session, token }
        const userJson = { ...user.toJSON(), password: undefined }
        delete userJson.password
        res.status(200).json({ ...userJson, token, message: 'You have been signed in!' })
    } catch (e) {
        console.error(e)
        res.status(400).json({ message: "Couldn't sign in" })
    }
}

export const signOut = async (req: Request, res: Response) => {
    try {
        req.session = undefined
        return res.status(200).send({ message: "You've been signed out!" })
    } catch (e) {
        res.status(400).json({ message: "Couldn't sign out" })
    }
}

export const currentUser = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('roles')
        if (!user) return res.status(404).json({ message: 'User not found!' })
        const { username, roles, _id, email } = user
        return res.json({ id: _id, username, roles, email })
    } catch (e) {
        console.error(e)
        return res.status(400).json({ message: "Couldn't get current user" })
    }
}
