import { Document } from 'mongoose'
import { UserDocument } from './UserInterface'
import { SongDocument } from './SongInterface'

export interface PlaylistI {
    title: string
    image: {
        cover?: string
        thumbnail?: string
    }
    user: UserDocument['_id']
    songs: SongDocument['_id'][]
    timestamp?: Date
}

export interface PlaylistDocument extends PlaylistI, Document {}
