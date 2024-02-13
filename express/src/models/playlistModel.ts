import { PlaylistDocument } from '../interfaces/PlaylistInterface'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongoose, { Schema } from 'mongoose'
import UserModel from './userModel'
import { PaginateModel } from 'mongoose'

const PlaylistSchema = new Schema({
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
            ref: 'Song',
        },
    ],
    timestamp: { type: Date, default: new Date() },
})

PlaylistSchema.plugin(mongoosePaginate)
const PlaylistModel = mongoose.model<PlaylistDocument, PaginateModel<PlaylistDocument>>('Playlist', PlaylistSchema)

export { PlaylistModel }
