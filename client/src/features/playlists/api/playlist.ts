import { API } from '@/constants'
import {
  IPlaylist,
  IPlaylistCreateResponse,
  IPlaylistDataForm,
  IPlaylistSongUpdateResponse,
  IPlaylistsResponse,
  IPlaylistUpdateResponse,
} from '@/features/playlists/types'
import http, { httpForm } from '@/http-common'

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
  create: async (playlist: IPlaylistDataForm) => {
    return await httpForm.post<IPlaylistCreateResponse>(`${API}/playlists`, createPlaylistFormData(playlist))
  },
  update: async (playlistId: string, playlist: IPlaylistDataForm) => {
    return await httpForm.put<IPlaylistUpdateResponse>(
      `${API}/playlists/${playlistId}`,
      createPlaylistFormData(playlist),
    )
  },
  addSong: async (playlistId: string, songId: string) =>
    await http.put<IPlaylistSongUpdateResponse>(`${API}/playlists/${playlistId}/songs/${songId}`),
  removeSong: async (playlistId: string, songId: string) =>
    await http.delete<IPlaylistSongUpdateResponse>(`${API}/playlists/${playlistId}/songs/${songId}`),
}

function createPlaylistFormData(playlist: IPlaylistDataForm) {
  const formData = new FormData()

  formData.append('title', playlist.title)
  const { cover, thumbnail } = playlist.image
  cover && formData.append('cover', typeof cover === 'string' ? cover : cover[0])
  thumbnail && formData.append('thumbnail', typeof thumbnail === 'string' ? thumbnail : thumbnail[0])

  return formData
}
