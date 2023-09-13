import { create } from 'zustand'

import { ISong } from '@/features/songs/types'

import { useRadio } from './radio'

export interface PlayerSongI {
  id: string
  title: string
  subtitle?: string
  image: string
  src: string
  downloadUrl?: string
}

interface PlayerState {
  id: string
  title: string
  subtitle?: string
  img?: string
  songs: PlayerSongI[]
  activeSongId?: string
  play: boolean
}

interface PlayerFn {
  playSong: (song: ISong) => void
  playPlaylist: (playlistId: string, songs: ISong[], activeSongId: string) => void
  removeSong: (song: ISong) => void
}

const defaultState: PlayerState = {
  title: '',
  subtitle: '',
  img: '',
  songs: [],
  activeSongId: '',
  id: '',
  play: false,
}

export const usePlayer = create<PlayerState & PlayerFn>()(set => ({
  ...defaultState,
  playSong: (song: ISong) => {
    useRadio.setState({ isLive: false })
    return set(prev => ({
      ...prev,
      songs: [
        {
          id: song._id,
          image: song.image.cover ?? song.image.thumbnail ?? '',
          src: song.musicUrl ?? '',
          title: song.name,
          subtitle: song.artist,
        },
      ],
      activeSongId: song._id,
      play: true,
    }))
  },
  playPlaylist: (playlistId: string, songs: ISong[], activeSongId: string) => {
    useRadio.setState({ isLive: false })
    set(prev => ({
      ...prev,
      songs:
        songs?.map(s => ({
          id: s._id,
          image: s.image.cover ?? s.image.thumbnail ?? '',
          src: s.musicUrl,
          title: s.name,
          subtitle: s.artist,
        })) ?? [],
      activeSongId: activeSongId,
      id: playlistId,
      play: true,
    }))
  },
  removeSong: (song: ISong) => set(prev => ({ ...prev, songs: prev.songs.filter(s => s.id !== song._id) })),
}))
