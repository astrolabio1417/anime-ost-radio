import { Document } from 'mongoose'

export interface RoleI {
    name: string
}

export interface RoleDocument extends RoleI, Document {}
