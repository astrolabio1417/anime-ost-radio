import { IRole, ROLES_DICT } from './../models/roleModel'
import Jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import UserModel from '../models/userModel'
import bcrypt from 'bcryptjs'
import RoleModel from '../models/roleModel'
import { zParse } from '../helpers/zParse'
import { authSchema } from '../schemas/authSchema'
import tryCatch from '../helpers/tryCatch'

export const signUp = tryCatch(async (req: Request, res: Response) => {
    const { body } = await zParse(authSchema.signUp, req)
    const { username, email, password, roles } = body

    const userExisted = await UserModel.findOne({ username })
    if (userExisted) return res.status(400).json({ message: 'Username is already in used!' })
    const emailExisted = await UserModel.findOne({ email })
    if (emailExisted) return res.status(400).json({ message: 'Email is already in used!' })
    const newUser = new UserModel({ username, email, password: bcrypt.hashSync(password, 8) })

    if (roles && req.user.isAuthenticated) {
        const user = await UserModel.findById(req.user.id).populate<{ roles: IRole[] }>('roles')
        const isAdmin = user?.roles.find(a => a.name === ROLES_DICT.ADMIN)

        if (isAdmin) {
            const modelRoles = await RoleModel.find({ name: { $in: body.roles } })
            newUser.roles = modelRoles.map(role => role._id)
        }
    }

    const userRole = await RoleModel.findOne({ name: 'user' })
    if (!userRole) return res.status(500).json({ message: '"user" role is missing on userModel' })
    newUser.roles = [...newUser.roles, userRole._id]
    await newUser.save()
    res.json({ message: 'User was registered successfully!' })
})

export const signIn = tryCatch(async (req: Request, res: Response) => {
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET is not defined' })

    const { body } = await zParse(authSchema.signIn, req)
    const { username, password } = body
    const user = await UserModel.findOne({ username }).populate('roles').select('+password')
    if (!user) return res.status(400).json({ message: 'Wrong username or password' })
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) return res.status(400).json({ message: 'Wrong username or password' })
    const token = Jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400 * 30, // 30 days
    })
    req.session = { ...req.session, token }
    const userJson = { ...user.toJSON(), password: undefined }
    res.status(200).json({ ...userJson, token, message: 'You have been signed in!' })
})

export const signOut = tryCatch(async (req: Request, res: Response) => {
    req.session = undefined
    return res.status(200).send({ message: "You've been signed out!" })
})

export const currentUser = tryCatch(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user.id).populate('roles')
    if (!user) return res.status(404).json({ message: 'User not found!' })
    const { username, roles, _id, email } = user
    return res.json({ id: _id, username, roles, email })
})
