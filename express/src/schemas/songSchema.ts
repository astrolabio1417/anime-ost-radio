import mongoose from 'mongoose'
import { z } from 'zod'

const songListSchema = z.object({
    query: z.object({
        page: z.preprocess(x => (x ? x : 1), z.coerce.number().int()),
        limit: z.preprocess(x => (x ? x : 30), z.coerce.number().int()),
        name: z.string().optional(),
        artist: z.string().optional(),
        show: z.string().optional(),
        sort: z
            .union([z.string(), z.array(z.string()), z.object({ timestamp: z.number() })])
            .optional()
            .default({ timestamp: 1 }),
    }),
})

const songRetrieveSchema = z.object({
    params: z.object({ id: z.string().refine(mongoose.Types.ObjectId.isValid) }),
})

const createSongSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        show: z.string().min(1),
        artist: z.string().optional(),
        musicUrl: z.string().url(),
        timestamp: z.string().optional(),
        image: z.object({
            cover: z.string().url().nullable(),
            thumbnail: z.string().url().nullable(),
        }),
    }),
})

const songSchema = {
    list: songListSchema,
    retrieve: songRetrieveSchema,
    create: createSongSchema,
}

export { songSchema }
