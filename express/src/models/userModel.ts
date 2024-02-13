import { UserDocument } from './../interfaces/UserInterface'
import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    username: String,
    email: { type: String, select: false },
    password: { type: String, select: false },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
})

const UserModel = mongoose.model<UserDocument>('User', UserSchema)

export default UserModel
