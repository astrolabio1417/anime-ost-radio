import http from '@/http-common'

import { ISong, ISongListResponse } from '../types'

export const apiSong = {
  songs: async (query?: { [key: string]: string }, page?: number) => {
    const params = new URLSearchParams()
    page && params.set('page', `${page}`)
    query && Object.keys(query).map(key => params.set(key, query[key]))
    return await http.get<ISongListResponse>('/songs', { params })
  },
  song: async (songId: string) => await http.get<ISong>(`/songs/${songId}`),
}
