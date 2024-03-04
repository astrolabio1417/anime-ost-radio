import z from 'zod'

const RegisterSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    password2: z.string().min(6),
    roles: z.array(z.enum(['user', 'admin'] as const)).optional(),
  })
  .refine(data => data.password === data.password2, {
    message: 'Password do not match',
    path: ['password2'],
  })

export type RegisterData = z.infer<typeof RegisterSchema>

export default RegisterSchema
