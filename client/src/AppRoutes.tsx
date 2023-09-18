import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'

import Loading from './components/Loading'
import { socket } from './zustand/radio'

const QueueSongs = React.lazy(() => import('./features/songs/routes/QueueSongs'))
const Songs = React.lazy(() => import('./features/songs/routes/Songs'))
const Login = React.lazy(() => import('./features/auth/routes/Login'))
const Register = React.lazy(() => import('./features/auth/routes/Register'))
const Playlists = React.lazy(() => import('./features/playlists/routes/Playlists'))
const Playlist = React.lazy(() => import('./features/playlists/routes/Playlist'))
const Song = React.lazy(() => import('@/features/songs/routes/Song'))
const Artists = React.lazy(() => import('@/features/artist/routes/Artists'))
const Artist = React.lazy(() => import('@/features/artist/routes/Artist'))
const Shows = React.lazy(() => import('@/features/show/Routes/Shows'))
const Show = React.lazy(() => import('@/features/show/Routes/Show'))

function Microphone() {
  const mediaRecorderRef = useRef<MediaRecorder>()
  const [searchParams, setSearchParams] = useSearchParams()
  const isRecording = searchParams.get('recording') === 'true'

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000,
        mimeType: 'audio/webm;codecs=opus',
      })
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.ondataavailable = e => {
        const packet = e.data
        socket.emit('stream', packet)
        console.log('emitting...', { bitrate: mediaRecorder.audioBitsPerSecond })
      }
    })
    return () => stop()
  }, [])

  function record() {
    if (mediaRecorderRef.current?.state === 'recording') return
    console.log(mediaRecorderRef.current)
    mediaRecorderRef.current?.start(100)
    setSearchParams(params => {
      params.set('recording', 'true')
      return params
    })
  }

  function stop() {
    setSearchParams(params => {
      params.set('recording', 'false')
      return params
    })
    mediaRecorderRef.current?.stop()
    socket.emit('end-stream', true)
  }

  return <>{isRecording ? <button onClick={stop}>Stop</button> : <button onClick={record}>Start</button>}</>
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<QueueSongs />} />
        <Route path="/search" element={<Songs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/playlists/" element={<Playlists />} />
        <Route path="/playlists/:id" element={<Playlist />} />
        <Route path="/songs/:id" element={<Song />} />
        <Route path="/artists/" element={<Artists />} />
        <Route path="/artists/:id" element={<Artist />} />
        <Route path="/shows/" element={<Shows />} />
        <Route path="/shows/:id" element={<Show />} />
        <Route path="/microphone" element={<Microphone />} />
      </Routes>
    </Suspense>
  )
}
