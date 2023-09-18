import { API } from '@/constants'
import { CreatePlaylistI, IPlaylist, IPlaylistsResponse } from '@/features/playlists/types'
import { ISong } from '@/features/songs/types'
import http from '@/http-common'

export const apiPlaylist = {
  get: async (playlistId: string) => await http.get<IPlaylist>(`${API}/playlists/${playlistId}`),
  lists: async ({
    user,
    query,
    page,
    limit,
  }: {
    user?: string
    page?: string
    limit?: number
    query?: { [key: string]: string }
  }) => {
    const params = new URLSearchParams()
    params.set('page', `${page ?? '1'}`)
    user && params.set('user', `${user}`)
    limit && params.set('limit', `${limit}`)
    query && Object.keys(query).map(key => params.set(key, query[key]))
    return await http.get<IPlaylistsResponse>(`${API}/playlists`, { params })
  },
  create: async (playlist: CreatePlaylistI) =>
    await http.post<{ message: string; playlist?: IPlaylist }>(`${API}/playlists`, playlist),
  addSong: async (playlistId: string, songId: string) =>
    await http.put<{ message: string; song?: ISong }>(`${API}/playlists/${playlistId}/songs/${songId}`),
  removeSong: async (playlistId: string, songId: string) =>
    await http.delete<{ message: string }>(`${API}/playlists/${playlistId}/songs/${songId}`),
}
