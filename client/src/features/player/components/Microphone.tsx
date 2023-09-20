import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import { IconButton, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

import { PEER_EVENTS, RTC_CONFIG } from '@/constants'

const socket = io(import.meta.env.VITE_SERVER_URL)
const MICROPHONE_ACCESS_DENIED_ERROR = 'Microphone access denied, check your microphone permission'

export default function Microphone() {
  const [users, setUsers] = useState<string[]>([])
  const [isLive, setIsLive] = useState(false)

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map())
  const connected = useRef<Set<string>>(new Set())
  const localStream = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!isLive) return

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

    socket.on(PEER_EVENTS.UPDATE_USER_LIST, (data: { users: string[] }) => {
      toast(`${data.users.length} users connected`)
      data.users.map(user => createPeerConnection(user).then(() => createOffer(user)))
      setUsers(data.users)
    })

    socket.on(PEER_EVENTS.ADD_USER, (data: { user: string }) => {
      toast(`1 user connected`)
      createPeerConnection(data.user).then(() => createOffer(data.user))
      setUsers(p => (p.includes(data.user) ? p : [...p, data.user]))
    })

    socket.on(PEER_EVENTS.REMOVE_USER, (data: { user: string }) => {
      toast(`1 user disconnected`)
      setUsers(p => p.filter(user => user !== data.user))
      peerConnections.current.get(data.user)?.close()
      peerConnections.current.delete(data.user)
      connected.current.delete(data.user)
    })

    socket.emit('listen', {})

    return () => {
      const events = [
        PEER_EVENTS.UPDATE_USER_LIST,
        PEER_EVENTS.REMOVE_USER,
        PEER_EVENTS.ADD_USER,
        PEER_EVENTS.CALL_MADE,
        PEER_EVENTS.ANSWER_MADE,
      ]
      events.forEach(e => socket.off(e))

      setUsers([])
      peerConnections.current.forEach(peer => peer.close())
      peerConnections.current = new Map()
      connected.current = new Set()
    }
  }, [isLive])

  async function createPeerConnection(peerId: string) {
    const peerConnection = new RTCPeerConnection(RTC_CONFIG)

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        if (!localStream.current) return toast('CANNOT GET THE USER MEDIA', { type: 'error' })
        peerConnection.addTrack(track, localStream.current)
      })
    } else {
      toast(MICROPHONE_ACCESS_DENIED_ERROR, { type: 'error' })
    }

    peerConnection.oniceconnectionstatechange = () => {
      const iceConnectionState = peerConnection.iceConnectionState

      if (iceConnectionState === 'disconnected') {
        toast('The RTCPeerConnection is disconnected', { type: 'error' })
      } else if (iceConnectionState === 'failed') {
        toast('The RTCPeerConnection is failed', { type: 'error' })
      }
    }

    peerConnections.current.set(peerId, peerConnection)
    return peerConnection
  }

  async function createOffer(peerId: string) {
    const peerConnection = peerConnections.current.get(peerId)
    if (!peerConnection) return console.error('NO PEER CONNECTION')
    if (!localStream.current) return toast(MICROPHONE_ACCESS_DENIED_ERROR, { type: 'error' })

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    socket.emit('call-user', { offer, to: peerId })

    return peerConnection
  }

  function goLive() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
      if (!stream) return toast(MICROPHONE_ACCESS_DENIED_ERROR, { type: 'error' })
      localStream.current = stream
      setIsLive(true)
      socket.emit('listeners', {})
    })
  }

  function goOffline() {
    setIsLive(false)
    peerConnections.current.forEach(peer => peer.close())
    peerConnections.current.clear()
    connected.current = new Set()
    peerConnections.current = new Map()
  }

  return (
    <>
      <Typography variant="body2">{users.length ?? 0} listeners</Typography>
      {isLive ? (
        <IconButton color="primary" onClick={goOffline} title="Stop Microphone Streaming">
          <MicIcon />
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={goLive} title="Start Microphone Streaming">
          <MicOffIcon />
        </IconButton>
      )}
    </>
  )
}
