import mongoose, { Schema } from 'mongoose'
import UserModel from './userModel'

export type ISong = {
    sourceId: string
    musicUrl?: string
    name: string
    duration?: number
    artist?: string
    show: {
        name?: string
        id?: string
    }
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
} & Document

export const SongSchema = new mongoose.Schema({
    sourceId: {
        unique: true,
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    duration: {
        required: false,
        type: Number,
    },
    artist: {
        required: false,
        type: String,
    },
    musicUrl: {
        required: false,
        type: String,
    },
    show: {
        name: { required: false, type: String },
        id: { required: false, type: String },
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
    played: {
        required: true,
        type: Boolean,
    },
    vote: {
        list: [{ type: Schema.Types.ObjectId, ref: UserModel }],
        total: {
            type: Number,
            required: true,
        },
        timestamp: {
            type: Date,
        },
    },
    timestamp: {
        required: true,
        type: Date,
    },
})

const SongModel = mongoose.model<ISong>('Song', SongSchema)

export async function cleanSongModel() {
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
