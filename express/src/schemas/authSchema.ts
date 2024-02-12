import { z } from 'zod'

const signUpSchema = z.object({
    body: z.object({
        username: z.string().min(4).max(30),
        email: z.string().email(),
        password: z.string().min(5),
        roles: z.string().array().optional(),
    }),
})

const signInSchema = z.object({
    body: z.object({
        username: z.string(),
        password: z.string().min(4),
    }),
})

const authSchema = {
    signIn: signInSchema,
    signUp: signUpSchema,
}

export { authSchema }
