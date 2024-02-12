import { z } from 'zod'
import mongoose from 'mongoose'

const retrieveSchema = z.object({
    params: z.object({ id: z.string().refine(mongoose.Types.ObjectId.isValid) }),
})

const listPlaylistSchema = z.object({
    query: z.object({
        sort: z.union([z.string(), z.array(z.string()), z.object({ timestamp: z.number() })]).optional(),
        limit: z.preprocess(x => (x ? x : 30), z.coerce.number().int()).optional(),
        page: z.preprocess(x => (x ? x : 1), z.coerce.number().int()).optional(),
        user: z.string().refine(mongoose.Types.ObjectId.isValid).optional(),
        title: z.string().optional(),
    }),
})

const createPlaylistSchema = z.object({
    body: z.object({
        title: z
            .string({ required_error: 'Playlist Title is required' })
            .min(1)
            .max(50, { message: 'Playlist Title not more than 50 length' }),
        cover: z.string().url().optional(),
        thumbnail: z.string().url().optional(),
    }),
})

const updatePlaylistSchema = createPlaylistSchema.extend({
    params: z.object({ id: z.string().refine(mongoose.Types.ObjectId.isValid) }),
})

const addSongPlaylistSchema = z.object({
    params: z.object({
        songId: z.string().refine(mongoose.Types.ObjectId.isValid),
        id: z.string().refine(mongoose.Types.ObjectId.isValid),
    }),
})

const playlistSchema = {
    retrieve: retrieveSchema,
    list: listPlaylistSchema,
    create: createPlaylistSchema,
    addSong: addSongPlaylistSchema,
    update: updatePlaylistSchema,
}

export { playlistSchema }
