import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import { ISong } from '@/features/songs/types'

export default function useQueue() {
  const [queue, setQueue] = useState<ISong[]>([])
  const [track, setTrack] = useState<{
    current?: ISong
    timemark: number
  }>({
    current: undefined,
    timemark: 0,
  })
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL)

    socket.on('connect', () => {
      console.log('connected to socket!')
      setConnected(true)
    })

    socket.on('queue-list', (queue: ISong[]) => {
      setQueue(queue)
      console.log({ queue })
    })

    socket.on('playing', (track: ISong, timemark: number) => {
      setTrack({ current: track, timemark })
      console.log({ track, timemark })
    })

    socket.on('ON_TRACK_CHANGE', (track: ISong) => {
      setTrack(prev => ({ ...prev, current: track }))
      console.log({ track })
    })

    socket.on('ON_TIME_CHANGE', (timemark: number) => {
      setTrack(prev => ({ ...prev, timemark: timemark }))
      console.log({ timemark })
    })
  }, [])

  return { queue, setQueue, track, setTrack, connected, setConnected }
}
