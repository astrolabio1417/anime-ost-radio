import { NextFunction, Request, Response } from "express"
import { IExpressMulerFile } from "./upload"

export const createPlaylistParser = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: IExpressMulerFile[] | null | undefined }

    req.body.cover = req.body.cover ?? files?.cover?.[0]?.location
    req.body.thumbnail = req.body.thumbnail ?? files?.thumbnail?.[0]?.location

    next()
}