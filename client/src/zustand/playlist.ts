import { create } from 'zustand'

import { IPlaylist } from '@/features/playlists/types'
import { ISong } from '@/features/songs/types'

interface PlaylistsState {
  playlists: IPlaylist[]
}

interface PlaylistsFunction {
  addPlaylist: (playlist: IPlaylist) => void
  addSongToPlaylist: (playlistId: string, song: ISong) => void
  removeSongToPlaylist: (playlistId: string, song: ISong) => void
  clearPlaylists: () => void
}

const defaultState: PlaylistsState = {
  playlists: [],
}

export const useUserPlaylists = create<PlaylistsState & PlaylistsFunction>(set => ({
  ...defaultState,
  addPlaylist: playlist =>
    set(prev => ({ playlists: [...prev.playlists.filter(p => p._id !== playlist._id), playlist] })),
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
  clearPlaylists: () => set({ ...defaultState }),
}))
