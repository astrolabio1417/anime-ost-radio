import { Request, Response } from 'express'
import SongModel from '../models/songModel'
import tryCatch from '../helpers/tryCatch'
import { zParse } from '../helpers/zParse'
import { showSchema } from '../schemas/showSchema'
import { Base64 } from 'js-base64'

export const showList = tryCatch(async (req: Request, res: Response) => {
    const list = await SongModel.find().distinct('show')
    res.json(list)
})

export const showRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(showSchema.retrieve, req)
    const { show } = params
    const showName = decodeURIComponent(Base64.atob(show))
    const list = await SongModel.find({ show: showName }) // case sensitive
    res.json({ show: showName, songs: list })
})
