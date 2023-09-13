import { Download, Pause, PlayArrow } from '@mui/icons-material'
import { Box, IconButton, Slider, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  play: boolean
  src: string
  downloadLink?: string
  onError?(e: React.SyntheticEvent<HTMLAudioElement, Event>): void
  onPause?(e: React.SyntheticEvent<HTMLAudioElement, Event>): void
  onPlay?(e: React.SyntheticEvent<HTMLAudioElement, Event>): void
  onEnded?(e: React.SyntheticEvent<HTMLAudioElement, Event>): void
  onPlayChange?(status: boolean): void
  hidden?: boolean
}

export default function AudioPlayer(props: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isSliding, setIsSliding] = useState(false)

  useEffect(() => {
    const p = audioRef.current
    if (!p) return
    props.play ? p.play() : p.pause()
  }, [props.play])

  function onPlayClick() {
    const audio = audioRef?.current
    if (!audio) return
    audio.paused ? audio.play() : audio.pause()
  }

  function onEnded(e: React.SyntheticEvent<HTMLAudioElement, Event>) {
    console.log('player ended')
    setPlayingStatus(!audioRef?.current?.paused)
    props.onEnded?.(e)
  }

  function onPlay(e: React.SyntheticEvent<HTMLAudioElement, Event>) {
    console.log('on play')
    setPlayingStatus(true)
    props.onPlay?.(e)
  }

  function onPause(e: React.SyntheticEvent<HTMLAudioElement, Event>) {
    console.log('on pause')
    setPlayingStatus(false)
    props.onPause?.(e)
  }

  function onError(e: React.SyntheticEvent<HTMLAudioElement, Event>) {
    console.log('on error')
    setPlayingStatus(false)
    props.onError?.(e)
  }

  function setPlayingStatus(isPlaying: boolean) {
    setPlaying(isPlaying)
    props.onPlayChange?.(isPlaying)
  }

  function formatTime(secs: number) {
    if (isNaN(secs)) return '0:00'
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${minutes}:${returnedSeconds}`
  }

  return (
    <React.Fragment>
      <audio
        onTimeUpdate={e => {
          if (isSliding) return
          const currentTime = e?.currentTarget?.currentTime
          if (isNaN(currentTime)) return
          setCurrentTime(currentTime ?? 0)
        }}
        onProgress={() => {}}
        className="audio-player"
        src={props.src}
        ref={audioRef}
        onCanPlayThrough={() => {
          const p = audioRef.current
          if (!p) return
          props.play ? p.play() : p.pause()
        }}
        onPlay={onPlay}
        onEnded={onEnded}
        onPause={onPause}
        onError={onError}
      />

      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        justifyContent="center"
        display={props.hidden ? 'none' : 'flex'}
        width="100%"
      >
        <Typography variant="overline">{formatTime(currentTime)}</Typography>

        <Box sx={{ width: '100%' }}>
          <Slider
            sx={{ width: '100%' }}
            onChangeCommitted={(_, newValue) => {
              const value = Array.isArray(newValue) ? newValue[0] : newValue
              if (!audioRef.current || isNaN(value)) return
              audioRef.current.currentTime = value
              setIsSliding(false)
            }}
            onChange={(_, newValue) => {
              if (!isSliding) setIsSliding(true)
              const value = Array.isArray(newValue) ? newValue[0] : newValue
              if (isNaN(value)) return
              setCurrentTime(value ?? 0)
            }}
            value={isNaN(currentTime) ? 0 : currentTime ?? 0}
            max={!audioRef.current?.duration ? 0 : audioRef.current?.duration ?? 0}
            valueLabelDisplay="auto"
          />
        </Box>

        <Stack direction="row" spacing={1} margin="0 !important">
          <IconButton title="Play" color="primary" onClick={onPlayClick}>
            {!playing ? <PlayArrow /> : <Pause />}
          </IconButton>
          <a href={props.downloadLink ?? props.src} target="_blank">
            <IconButton title="Download" color="primary">
              <Download />
            </IconButton>
          </a>
        </Stack>
      </Stack>
    </React.Fragment>
  )
}
