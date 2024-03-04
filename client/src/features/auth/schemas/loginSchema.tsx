import { z } from 'zod'

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export type LoginData = z.infer<typeof LoginSchema>

export default LoginSchema
