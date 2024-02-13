import { Request, Response } from 'express'
import { PlaylistModel } from '../models/playlistModel'
import tryCatch from '../utils/tryCatch'
import { zParse } from '../utils/zParse'
import { playlistSchema } from '../schemas/playlistSchema'
import { playlistService } from '../services/playlistService'
import { StatusCodes } from 'http-status-codes'

export const playlistRetrieve = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.retrieve, req)
    const playlist = await PlaylistModel.findOne({ _id: params.id }).populate('songs').populate('user')
    res.json(playlist)
})

export const playlistList = tryCatch(async (req: Request, res: Response) => {
    const { query } = await zParse(playlistSchema.list, req)
    const { limit, page, sort, title, user } = query
    const playlists = await playlistService.getPlaylists({ title, user }, { page, limit, sort })
    res.json(playlists)
})

export const playlistCreate = tryCatch(async (req: Request, res: Response) => {
    const { body } = await zParse(playlistSchema.create, req)
    const { title, cover, thumbnail } = body
    const image = { cover, thumbnail }
    const playlist = await playlistService.createPlaylist({ title, user: req.user.id, image, songs: [] })
    res.status(201).json({ message: 'The playlist has been successfully created', playlist })
})

export const playlistDelete = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.retrieve, req)
    const data = { _id: params.id }
    const deleted = await playlistService.deletePlaylist(params.id, req.user.id)
    if (!deleted) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Playlist Not Found' })
    res.json({ message: 'The playlist has been successfully deleted', ...data })
})

export const playlistUpdate = tryCatch(async (req: Request, res: Response) => {
    const { body, params } = await zParse(playlistSchema.update, req)
    const { title, cover, thumbnail } = body
    const updatedPlaylist = await playlistService.updatePlaylist(params.id, { title, image: { cover, thumbnail } })
    if (!updatedPlaylist) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Playlist Not Found' })
    res.json({ playlist: updatedPlaylist, message: 'The playlist has been successfully updated' })
})

export const playlistAddSong = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.addSong, req)
    const { id: playlistId, songId } = params
    const playlist = await playlistService.addSongToPlaylist(playlistId, songId)
    if (!playlist) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Cannot add the song' })
    res.json({ playlist, playlistId, songId, message: 'The song was successfully added to the playlist' })
})

export const playlistRemoveSong = tryCatch(async (req: Request, res: Response) => {
    const { params } = await zParse(playlistSchema.addSong, req)
    const { id: playlistId, songId } = params
    const playlist = playlistService.removeSongFromPlaylist(playlistId, songId)
    if (!playlist) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Cannot remove the song' })
    res.json({ playlist, playlistId, songId, message: 'The song was successfully removed from the playlist' })
})
