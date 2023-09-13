import { API } from '@/constants'
import { CreatePlaylistI, IPlaylist } from '@/features/playlists/types'

interface PlaylistQueryI {
  user?: string
}

export const getPlaylists = async (query: PlaylistQueryI) => {
  const url = new URL(`${API}/playlists`)

  if (query) {
    Object.keys(query).map(key => {
      url.searchParams.append(key, `${query[key as keyof PlaylistQueryI]}`)
    })
  }

  try {
    const res = await fetch(url.toString())
    return (await res.json()) as IPlaylist[]
  } catch (e) {
    console.error(e)
    return
  }
}

export const createPlaylist = async (playlist: CreatePlaylistI, token: string) => {
  try {
    const res = await fetch(`${API}/playlists`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(playlist),
    })
    return { data: (await res.json()) as { message: string; playlist?: IPlaylist }, ok: res.ok }
  } catch (e) {
    console.error(e)
    return
  }
}

export const addSongToPlaylist = async (playlistId: string, songId: string, token: string) => {
  try {
    const res = await fetch(`${API}/playlists/${playlistId}/songs/${songId}`, {
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    })
    return { data: (await res.json()) as { message: string }, ok: res.ok }
  } catch (e) {
    console.error(e)
    return
  }
}

export const deleteSongToPlaylist = async (playlistId: string, songId: string, token: string) => {
  try {
    const res = await fetch(`${API}/playlists/${playlistId}/songs/${songId}`, {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    })
    return { data: (await res.json()) as { message: string }, ok: res.ok }
  } catch (e) {
    console.error(e)
    return
  }
}

export const getPlaylist = async (playlistId: string): Promise<IPlaylist> => {
  const res = await fetch(`${API}/playlists/${playlistId}`)
  return await res.json()
}
