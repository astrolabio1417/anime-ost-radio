import { SongDocument } from './../interfaces/SongInterface'
import mongoose, { Schema } from 'mongoose'
import UserModel from './userModel'
import mongoosePaginate from 'mongoose-paginate-v2'

export const SongSchema = new mongoose.Schema({
    name: { required: true, type: String },
    duration: { required: false, type: Number },
    artist: { required: false, type: String },
    musicUrl: { required: false, type: String },
    show: { type: String },
    timestamp: { required: true, type: Date, default: new Date() },
    played: { required: true, type: Boolean, default: false },
    image: {
        cover: { required: false, type: String },
        thumbnail: { required: false, type: String },
    },
    vote: {
        list: {
            type: [{ type: Schema.Types.ObjectId, ref: UserModel }],
            default: [],
            required: true,
        },
        total: { type: Number, default: 0, required: true },
        timestamp: { type: Date },
    },
})

SongSchema.index({ name: 1, artist: 1, show: 1 }, { unique: true })
SongSchema.plugin(mongoosePaginate)
const SongModel = mongoose.model<SongDocument, mongoose.PaginateModel<SongDocument>>('Song', SongSchema)

export default SongModel
