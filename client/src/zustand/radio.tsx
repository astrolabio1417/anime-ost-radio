import { create } from 'zustand'

import { socket } from '@/appSocket'
import { NGINX_HLS_FRAGMENT, RADIO_EVENTS, RADIO_STREAM } from '@/constants'
import { ISong } from '@/features/songs/types'

import { PlayerSongI } from './player'

interface RadioState {
  current: ISong
  queue: ISong[]
  isLive: boolean
}

interface RadioFn {
  parsedSong: () => PlayerSongI
  parsedSongs: () => PlayerSongI[]
}

const defaultState: RadioState = {
  current: {
    _id: '',
    sourceId: '',
    name: '',
    musicUrl: '',
    show: '',
    image: {},
    played: false,
    vote: {
      list: [],
      total: 0,
      timestamp: undefined,
    },
  },
  queue: [],
  isLive: true,
}

export const useRadio = create<RadioState & RadioFn>()((set, get) => ({
  ...defaultState,
  parsedSong: () => {
    const { current } = get()
    return {
      id: current._id,
      image: current.image.cover ?? current.image.thumbnail ?? '',
      src: RADIO_STREAM,
      title: current.name,
      subtitle: current.artist,
      downloadUrl: current.musicUrl,
    }
  },
  parsedSongs: () => {
    const { queue } = get()

    return queue.map(song => ({
      id: song._id,
      image: song.image.cover ?? song.image.thumbnail ?? '',
      src: RADIO_STREAM,
      title: song.name,
      subtitle: song.artist,
      downloadUrl: song.musicUrl,
    }))
  },
}))

socket.on(RADIO_EVENTS.ON_QUEUE_CHANGE, (queue: ISong[]) => {
  console.log({ queue })
  const hasQueue = useRadio.getState().queue.length
  setTimeout(() => useRadio.setState({ queue: queue ?? [] }), hasQueue ? NGINX_HLS_FRAGMENT : 0)
})

socket.on(RADIO_EVENTS.ON_TRACK_CHANGE, (track: ISong) => {
  console.log({ track })
  const hasTrack = !!useRadio.getState().current._id
  setTimeout(() => useRadio.setState({ current: track }), hasTrack ? NGINX_HLS_FRAGMENT : 0)
})
