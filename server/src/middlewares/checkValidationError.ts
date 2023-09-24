import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

const checkValidationError = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation Failed',
            errors: errors.array(),
        })
    }

    next()
}

export default checkValidationError
