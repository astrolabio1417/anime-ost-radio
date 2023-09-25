import { AxiosError } from 'axios'
import { create } from 'zustand'

import { apiPlaylist } from '@/features/playlists/api/playlist'
import { IPlaylist } from '@/features/playlists/types'
import { ISong } from '@/features/songs/types'

interface PlaylistsState {
  playlists: IPlaylist[]
}

interface PlaylistsFunction {
  init: (userId: string) => void
  addPlaylist: (playlist: IPlaylist) => void
  removePlaylist: (playlistId: string) => void
  updatePlaylist: (playlistId: string, playlist: IPlaylist) => void
  addSongToPlaylist: (playlistId: string, song: ISong) => void
  removeSongToPlaylist: (playlistId: string, song: ISong) => void
  clearPlaylists: () => void
}

const defaultState: PlaylistsState = {
  playlists: [],
}

export const useUserPlaylists = create<PlaylistsState & PlaylistsFunction>(set => ({
  ...defaultState,
  init: async (userId: string) => {
    try {
      const userPlaylists = await apiPlaylist.lists({ user: userId, limit: 1000 })
      set({ playlists: userPlaylists.data.docs ?? [] })
    } catch (e) {
      const error = e as AxiosError<Error>
      console.error(error)
    }
  },
  addPlaylist: playlist =>
    set(prev => ({ playlists: [...prev.playlists.filter(p => p._id !== playlist._id), playlist] })),
  removePlaylist: playlistId => set(prev => ({ playlists: prev.playlists.filter(p => p._id !== playlistId) })),
  addSongToPlaylist: (playlistId, song: ISong) =>
    set(prev => ({
      playlists: prev.playlists.map(p => (p._id === playlistId ? { ...p, songs: [...p.songs, song] } : p)),
    })),
  removeSongToPlaylist: (playlistId, song) =>
    set(prev => ({
      playlists: prev.playlists.map(p =>
        p._id === playlistId ? { ...p, songs: p.songs.filter(s => s._id !== song._id) } : p,
      ),
    })),
  updatePlaylist: (playlistId, playlist) =>
    set(prev => ({
      ...prev,
      playlists: prev.playlists.map(p => (p._id === playlistId ? playlist : p)),
    })),
  clearPlaylists: () => set({ ...defaultState }),
}))
