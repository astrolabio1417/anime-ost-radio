import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const message = err instanceof ZodError ? fromZodError(err).message : err.message
    res.status(500).send({ message, stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined })
}

export default errorHandlerMiddleware
