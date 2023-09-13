import mongoose, { Schema } from 'mongoose'
import RoleModel from './roleModel'

type UserI = {
    username: string
    email: string
    password: string
    roles: mongoose.Types.ObjectId[]
}

const UserModel = mongoose.model(
    'User',
    new Schema<UserI>({
        username: String,
        email: {
            type: String,
            select: false,
        },
        password: {
            type: String,
            select: false,
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: RoleModel,
            },
        ],
    }),
)

export default UserModel
