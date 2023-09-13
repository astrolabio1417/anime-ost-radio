import mongoose, { Schema } from 'mongoose'
import SongModel from './songModel'
import UserModel from './userModel'

export type PlaylistI = {
    title: string
    image: {
        cover?: string
        thumbnail?: string
    }
    user: Schema.Types.ObjectId
    songs: Schema.Types.ObjectId[]
}

export const PlaylistModel = mongoose.model(
    'Playlist',
    new Schema({
        title: {
            required: true,
            type: String,
        },
        image: {
            cover: {
                required: false,
                type: String,
            },
            thumbnail: {
                required: false,
                type: String,
            },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: UserModel,
        },
        songs: [
            {
                type: Schema.Types.ObjectId,
                ref: SongModel,
            },
        ],
    }),
)
