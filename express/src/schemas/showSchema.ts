import { Base64 } from 'js-base64'
import { z } from 'zod'

const retrieveShowSchema = z.object({
    params: z.object({ show: z.string().refine(Base64.isValid) }),
})

const showSchema = {
    retrieve: retrieveShowSchema,
}

export { showSchema }
