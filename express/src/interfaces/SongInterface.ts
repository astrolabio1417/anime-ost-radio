import { Document } from 'mongoose'
import { UserDocument } from './UserInterface'

export interface SongI {
    name: string
    musicUrl?: string
    duration?: number
    artist?: string
    show: string
    image: {
        cover?: string
        thumbnail?: string
    }
    played: boolean
    vote: {
        list: UserDocument['_id'][]
        total: number
        timestamp?: Date
    }
    timestamp: Date
}

export interface SongDocument extends SongI, Document {}
