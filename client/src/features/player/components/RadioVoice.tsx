import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

import { PEER_EVENTS, RTC_CONFIG } from '@/constants'
import { usePlayer } from '@/zustand/player'

const socket = io(import.meta.env.VITE_SERVER_URL)

export default function RadioVoice() {
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const { play } = usePlayer()

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map())
  const connected = useRef<Set<string>>(new Set())

  useEffect(() => {
    socket.emit(play ? 'listen' : 'unlisten', {})
    play ? remoteAudioRef?.current?.play() : remoteAudioRef?.current?.pause()
  }, [play])

  useEffect(() => {
    async function handleOffer(peerId: string, offer: RTCSessionDescriptionInit) {
      const peerConnection = await createPeerConnection(peerId)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      socket.emit('make-answer', { answer, to: peerId })
    }

    async function handleAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
      const peerConnection = peerConnections.current.get(peerId)
      if (!peerConnection) return console.error('NO PEER CONNECTION')
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))

      if (connected.current.has(peerId)) {
        toast(`${connected.current.size} total peers connected!`)
        return console.log('ALREADY CONNECTED 2x offer completed! lol')
      }

      connected.current.add(peerId)
      createOffer(peerId)
    }

    socket.on(PEER_EVENTS.CALL_MADE, async (data: { offer: RTCSessionDescriptionInit; socket: string }) => {
      await handleOffer(data.socket, data.offer)
    })

    socket.on(PEER_EVENTS.ANSWER_MADE, async (data: { answer: RTCSessionDescriptionInit; socket: string }) => {
      await handleAnswer(data.socket, data.answer)
    })

    return () => {
      const events = [PEER_EVENTS.CALL_MADE, PEER_EVENTS.ANSWER_MADE]
      events.forEach(e => socket.off(e))
      peerConnections.current.forEach(peer => peer.close())
      peerConnections.current = new Map()
      connected.current = new Set()
    }
  }, [])

  async function createPeerConnection(peerId: string) {
    const peerConnection = new RTCPeerConnection(RTC_CONFIG)

    peerConnection.ontrack = event => {
      if (remoteAudioRef.current && event.streams && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0]
      }
    }

    peerConnections.current.set(peerId, peerConnection)
    return peerConnection
  }

  async function createOffer(peerId: string) {
    const peerConnection = peerConnections.current.get(peerId)
    if (!peerConnection) return console.error('NO PEER CONNECTION')

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    socket.emit('call-user', { offer, to: peerId })
    return peerConnection
  }

  return (
    <audio
      hidden
      onLoad={() => {
        play && remoteAudioRef.current?.play()
      }}
      ref={remoteAudioRef}
      autoPlay
      controls
    />
  )
}
