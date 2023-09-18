import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import { IconButton } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { socket } from '@/zustand/radio'

export default function Microphone() {
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
        console.log('emitting...', { bitrate: mediaRecorder.audioBitsPerSecond, packet })
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
    mediaRecorderRef.current?.stop()
    socket.emit('end-stream', true)
  }

  function handleMicOff() {
    setSearchParams(params => {
      params.set('recording', 'false')
      return params
    })
    stop()
  }

  return (
    <>
      {isRecording ? (
        <IconButton color="primary" onClick={handleMicOff} title="Stop Microphone Streaming">
          <MicIcon />
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={record} title="Start Microphone Streaming">
          <MicOffIcon />
        </IconButton>
      )}
    </>
  )
}
