import mongoosePaginate from 'mongoose-paginate-v2'
import mongoose, { Schema } from 'mongoose'
import UserModel from './userModel'

export type IPlaylist = {
    title: string
    image: {
        cover?: string
        thumbnail?: string
    }
    user: Schema.Types.ObjectId
    songs: Schema.Types.ObjectId[]
    timestamp: Date
}

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
    timestamp: { required: true, type: Date, default: new Date() },
})

PlaylistSchema.plugin(mongoosePaginate)

type PlaylistDocument = mongoose.Document & IPlaylist

const PlaylistModel = mongoose.model<IPlaylist, mongoose.PaginateModel<PlaylistDocument>>('Playlist', PlaylistSchema)

export { PlaylistModel }
