import { StatusCodes } from 'http-status-codes'

class ApiError extends Error {
    isOperational: boolean
    statusCode: StatusCodes

    constructor(statusCode: StatusCodes, message: string, isOperational = true, stack = '') {
        super(message)
        this.isOperational = isOperational
        this.statusCode = statusCode

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError
