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

const songSchema = {
    list: songListSchema,
    retrieve: songRetrieveSchema,
}

export { songSchema }
