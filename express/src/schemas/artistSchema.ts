import { z } from 'zod'
import { Base64 } from 'js-base64'

const artistRetrieveSchema = z.object({
    params: z.object({
        artist: z.string().refine(Base64.isValid),
    }),
})

const artistSchema = {
    retrieve: artistRetrieveSchema,
}

export { artistSchema }
