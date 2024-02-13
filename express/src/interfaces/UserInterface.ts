import { Document } from 'mongoose'
import { RoleDocument } from './RoleInterface'

export interface UserI {
    username: string
    email: string
    password: string
    roles: RoleDocument['_id'][]
}

export interface UserDocument extends UserI, Document {}
