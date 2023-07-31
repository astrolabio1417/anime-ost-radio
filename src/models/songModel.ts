import mongoose from "mongoose";

export interface ISong extends Document {
    sourceId: string;
    musicUrl?: string;
    name: string;
    duration?: number;
    artist?: string;
    show: {
        name?: string;
        id?: string;
    };
    image: {
        cover?: string;
        thumbnail?: string;
    };
    getDownloadLink(): string;
    played: boolean;
    vote: {
        list: string[];
        total: number;
        timestamp: Date;
    };
}

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
        get: function (musicUrl?: string) {
            return !musicUrl
                ? ""
                : `https://aimgf.youtube-anime.com/${musicUrl}`;
        },
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
        list: [{ type: String }],
        total: {
            type: Number,
            required: true,
        },
        timestamp: {
            type: Date,
        },
    },
});

const SongModel = mongoose.model<ISong>("Song", SongSchema);

export default SongModel;
