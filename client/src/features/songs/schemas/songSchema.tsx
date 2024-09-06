import { z } from 'zod'

import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_MUSIC_TYPES,
  MAX_IMAGE_UPLOAD_SIZE,
  MAX_MUSIC_UPLOAD_SIZE,
  UPLOAD_ERROR_MESSAGE,
} from '@/constants'

const SongSchema = z.object({
  name: z.string().min(1),
  show: z.string().min(1),
  artist: z.string().min(1),
  musicUrl: z.union([
    z.string().url(),
    z
      .instanceof(File)
      .refine(file => file && file.size <= MAX_MUSIC_UPLOAD_SIZE && ACCEPTED_MUSIC_TYPES.includes(file.type), {
        message: UPLOAD_ERROR_MESSAGE,
      }),
  ]),
  timestamp: z.string().optional(),
  cover: z
    .instanceof(File)
    .refine(file => file && file.size <= MAX_IMAGE_UPLOAD_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: UPLOAD_ERROR_MESSAGE,
    })
    .optional(),
  thumbnail: z
    .instanceof(File)
    .refine(file => file && file.size <= MAX_IMAGE_UPLOAD_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: UPLOAD_ERROR_MESSAGE,
    })
    .optional(),
})

export type SongSchemaData = z.infer<typeof SongSchema>

export default SongSchema
