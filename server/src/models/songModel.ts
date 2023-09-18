import mongoose, { Schema } from 'mongoose'
import UserModel from './userModel'
import mongoosePaginate from 'mongoose-paginate-v2'

export type ISong = {
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
        list: mongoose.Types.ObjectId[]
        total: number
        timestamp?: Date
    }
    timestamp: Date
}

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

export type SongDocument = mongoose.Document & ISong

const SongModel = mongoose.model<ISong, mongoose.PaginateModel<SongDocument>>('Song', SongSchema)

export async function cleanSongModel() {
    const updateTimestamp = await SongModel.updateMany({ timestamp: { $exists: false } }, [
        {
            $set: { timestamp: Date.now() },
        },
    ])
    console.log({ updateTimestamp })
    const updateShows = await SongModel.updateMany({ 'show.id': { $exists: true } }, [
        {
            $set: {
                show: '$show.name',
            },
        },
    ])
    console.log({ updateShows })

    // https://aimgf.youtube-anime.com/
    const updateMusic = await SongModel.updateMany({ musicUrl: { $regex: '^(?!https://).' } }, [
        {
            $set: {
                musicUrl: {
                    $concat: ['https://aimgf.youtube-anime.com/', '$musicUrl'],
                },
            },
        },
    ])
    console.log({ updateMusic })
    const updateImage = await SongModel.updateMany(
        {
            'image.cover': { $regex: '^__Music__' },
        },
        [
            {
                $set: {
                    'image.cover': {
                        $concat: ['https://wp.youtube-anime.com/aln.youtube-anime.com/images/', '$image.cover'],
                    },
                },
            },
        ],
    )
    console.log({ updateImage })
    const updateImage1 = await SongModel.updateMany(
        {
            'image.cover': { $regex: '^images' },
        },
        [
            {
                $set: {
                    'image.cover': {
                        $concat: ['https://wp.youtube-anime.com/aln.youtube-anime.com/', '$image.cover'],
                    },
                },
            },
        ],
    )
    console.log({ updateImage1 })
}

export default SongModel
