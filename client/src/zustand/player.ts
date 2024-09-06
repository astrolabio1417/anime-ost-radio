import { create } from 'zustand'

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
  songs: PlayerSongI[]
  currentSongId?: string
  isPlaying: boolean
  pageUrl?: string | null
  title?: string | null
}

interface PlaySongI extends Omit<PlayerState, 'id' | 'isPlaying'> {
  currentSongId: string
  isLive?: boolean
  playerId: string
}

interface PlayerFn {
  getCurrentSongIndex: () => number
  getCurrentSong: () => PlayerSongI | undefined
  addSong: (song: PlayerSongI) => void
  playSongs: (props: PlaySongI) => void
  removeSong: (songId: string) => void
  play: (songId?: string) => void
  pause: () => void
  nextSong: () => void
  prevSong: () => void
}

const defaultState: PlayerState = {
  id: '',
  songs: [],
  currentSongId: '',
  isPlaying: false,
}

export const usePlayer = create<PlayerState & PlayerFn>()((set, get) => ({
  ...defaultState,
  getCurrentSongIndex: () => {
    const { songs, currentSongId } = get()
    return songs.findIndex(a => a.id === currentSongId)
  },
  getCurrentSong: () => {
    const { songs, currentSongId } = get()
    return songs.find(a => a.id === currentSongId)
  },
  play: songId => set(state => ({ currentSongId: songId ?? state.currentSongId, isPlaying: true })),
  pause: () => set({ isPlaying: false }),
  addSong: song => set(state => ({ songs: [...state.songs, song] })),
  removeSong: songId => set(state => ({ songs: state.songs.filter(a => a.id !== songId) })),
  prevSong: () => {
    const { currentSongId, songs } = get()
    if (!songs) return
    if (!currentSongId) return set({ currentSongId: songs[0].id })
    const songIds = Object.keys(songs)
    const currentIndex = songIds.indexOf(currentSongId)
    const songsLength = songIds.length
    const prevIndex = (currentIndex - 1 + songsLength) % songsLength
    set({ currentSongId: songIds[prevIndex] })
  },
  nextSong: () => {
    const { currentSongId, songs } = get()
    if (!songs) return
    if (!currentSongId) return set({ currentSongId: songs[0].id })
    const songIds = Object.keys(songs)
    const currentIndex = songIds.indexOf(currentSongId)
    const songsLength = songIds.length
    const nextIndex = (currentIndex + 1) % songsLength
    set({ currentSongId: songIds[nextIndex] })
  },
  playSongs: ({ songs, currentSongId, isLive = false, playerId, pageUrl, title }) => {
    useRadio.setState({ isLive: isLive })
    set({
      songs,
      currentSongId,
      isPlaying: true,
      id: playerId,
      pageUrl: pageUrl || null,
      title: title || null,
    })
  },
}))
