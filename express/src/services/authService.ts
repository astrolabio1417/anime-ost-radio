import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import UserModel from '../models/userModel'
import RoleModel, { ROLES_DICT } from '../models/roleModel'
import { PlaylistModel } from '../models/playlistModel'
import ApiError from '../utils/ApiError'
import { StatusCodes } from 'http-status-codes'

async function isUserAdmin(userId: mongoose.Types.ObjectId | string) {
    const adminRole = await RoleModel.findOne({ name: ROLES_DICT.ADMIN })
    const user = await UserModel.findOne({ _id: userId, roles: { $in: [adminRole] } })
    return !!user
}

async function isUserPlaylist(userId: mongoose.Types.ObjectId | string, playlistId: mongoose.Types.ObjectId | string) {
    return !!(await PlaylistModel.findOne({ user: userId, _id: playlistId }))
}

async function signUp(username: string, email: string, password: string, roles: string[] = [ROLES_DICT.USER]) {
    const userExisted = await UserModel.findOne({ username })
    if (userExisted) throw new ApiError(StatusCodes.BAD_REQUEST, 'Username is already in used!')
    const emailExisted = await UserModel.findOne({ email })
    if (emailExisted) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is already in used!')
    const newUser = new UserModel({ username, email, password: bcrypt.hashSync(password, 8) })

    if (roles) {
        const modelRoles = await RoleModel.find({ name: { $in: roles } })
        newUser.roles = modelRoles.map(role => role._id)
    }

    await newUser.save()
}

async function signIn(username: string, password: string) {
    if (!process.env.JWT_SECRET) throw new ApiError(StatusCodes.BAD_REQUEST, 'JWT_SECRET is not defined')
    const user = await UserModel.findOne({ username }).populate('roles').select('+password')
    if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, 'Wrong username or password')
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) throw new ApiError(StatusCodes.BAD_REQUEST, 'Wrong username or password')
    const token = Jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400 * 30, // 30 days
    })

    return { token, user: { ...user.toJSON(), password: undefined } }
}

async function getUser(userId: mongoose.Types.ObjectId | string) {
    const user = await UserModel.findById(userId).populate('roles')
    if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found!')
    const { username, roles, _id, email } = user
    return { id: _id, username, roles, email }
}

const authService = {
    isUserAdmin,
    isUserPlaylist,
    signUp,
    signIn,
    getUser,
}

export { authService }
