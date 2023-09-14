import http from '@/http-common'

import { ISong, ISongListResponse } from '../types'

export const apiSong = {
  songs: async (query?: string, page?: number) => {
    const params = new URLSearchParams()
    page && params.set('page', `${page}`)
    query && params.set('search', query)
    return await http.get<ISongListResponse>('/songs', { params })
  },
  song: async (songId: string) => await http.get<ISong>(`/songs/${songId}`),
}
