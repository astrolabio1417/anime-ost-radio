import http, { httpForm } from '@/http-common'

import { SongSchemaData } from '../schemas/songSchema'
import { ISong, ISongListResponse } from '../types'

export const apiSong = {
  songs: async (query?: { [key: string]: string }, page?: number) => {
    const params = new URLSearchParams()
    page && params.set('page', `${page}`)
    query && Object.keys(query).map(key => params.set(key, query[key]))
    return await http.get<ISongListResponse>('/songs', { params })
  },
  song: async (songId: string) => await http.get<ISong>(`/songs/${songId}`),
  create: async (song: SongSchemaData) => await httpForm.post<ISong>(`/songs/`, createSongFormData(song)),
  delete: async (songId: string) =>
    await http.delete<{ deletedCount: number; acknowledged: boolean }>(`/songs/${songId}`),
}

function createSongFormData(song: SongSchemaData) {
  const form = new FormData()

  form.set('name', song.name)
  form.set('artist', song.artist)
  form.set('musicUrl', song.musicUrl)
  form.set('show', song.show)

  song.cover && form.set('cover', song.cover)
  song.thumbnail && form.set('thumbnail', song.thumbnail)

  return form
}
