import { NextFunction, Request, Response } from 'express'

const tryCatch =
    (
        controller: (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => Promise<Response<any, Record<string, any>> | undefined | void>,
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await controller(req, res, next)
        } catch (e) {
            return next(e)
        }
    }

export default tryCatch
