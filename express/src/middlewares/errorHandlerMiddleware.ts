import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import ApiError from '../utils/ApiError'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandlerMiddleware = (err: Error | ApiError | ZodError, req: Request, res: Response, next: NextFunction) => {
    const isZodError = err instanceof ZodError
    const isApiError = err instanceof ApiError
    const message = isZodError ? fromZodError(err).message : err.message
    const statusCode = isApiError
        ? err.statusCode
        : isZodError
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR

    res.status(statusCode).send({ message, stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined })
}

export default errorHandlerMiddleware
