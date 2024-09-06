import { Request, Response } from 'express'
import tryCatch from '../utils/tryCatch'
import { zParse } from '../utils/zParse'
import { showSchema } from '../schemas/showSchema'
import { Base64 } from 'js-base64'
import { songService } from '../services/songService'

export const showList = tryCatch(async (req: Request, res: Response) => {
    const list = await songService.getSongShows()
    res.json(list)
})

export const showRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(showSchema.retrieve, req)
    const { show } = params
    const showName = decodeURIComponent(Base64.atob(show))
    const list = await songService.getSongsByShow(showName) // case sensitive
    res.json({ show: showName, songs: list })
})
