import { create } from 'zustand'

import { socket } from '@/appSocket'
import { ISong } from '@/features/songs/types'

interface RadioState {
  current: ISong
  queue: ISong[]
  timestamp: number
  isConnected: boolean
  isLive: boolean
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
  timestamp: 0,
  isConnected: false,
  isLive: true,
}

export const useRadio = create<RadioState>()(() => ({ ...defaultState }))

socket.on('connect', () => {
  console.log('connected to socket!')
  useRadio.setState({ isConnected: true })
})

socket.on('ON_QUEUE_CHANGE', (queue: ISong[]) => {
  console.log({ queue })
  useRadio.setState({ queue: queue ?? [] })
})

socket.on('ON_TRACK_CHANGE', (track: ISong) => {
  console.log({ track })
  useRadio.setState({ current: track })
})

socket.on('ON_TIME_CHANGE', (timestamp: number) => {
  console.log({ timestamp })
  useRadio.setState({ timestamp })
})
