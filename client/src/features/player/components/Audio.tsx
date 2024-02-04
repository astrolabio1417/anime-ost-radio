import Hls from 'hls.js'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

interface AudioProps {
  src: string
  onEnd?: () => void
  onPlay?: () => void
  onLoad?: () => void
  onDurationChange: (duration: number) => void
  onTimeUpdate: (time: number) => void
  mute?: boolean
  volume?: number
  playing?: boolean
  hidden?: boolean
}

export interface AudioHandle {
  play: () => void
  pause: () => void
  muted: boolean
  setVolume: (value: number) => void
  seek: (value: number) => void
  seekToBufferedEnd: () => void
}

const Audio = forwardRef<AudioHandle, AudioProps>(function Audio(props, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useImperativeHandle(
    ref,
    () => {
      const audio = audioRef.current

      return {
        play() {
          if (isAudioLive()) audio?.load()
          audio?.play()
        },
        pause() {
          audio?.pause()
        },
        muted: !!props.mute,
        setVolume: setAudioVolume,
        seek: seekAudio,
        seekToBufferedEnd: seekToBufferedEnd,
      }
    },
    [props.mute],
  )

  useEffect(() => {
    if (!audioRef.current) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(props.src)
      hls.attachMedia(audioRef.current)
      return
    }

    audioRef.current.src = props.src
  }, [props.src])

  useEffect(() => {
    if (props.volume === undefined) return
    setAudioVolume(props.volume)
  }, [props.volume])

  useEffect(() => {
    if (props.playing === undefined) return
    props.playing ? audioRef.current?.play() : audioRef.current?.pause()
  }, [props.playing])

  function seekToBufferedEnd() {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = audio.buffered.end(0)
  }

  function isAudioLive() {
    return audioRef.current?.duration === Infinity
  }

  function seekAudio(value: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
  }

  function setAudioVolume(value: number) {
    const isValid = value >= 0 && value <= 1
    const audio = audioRef.current
    if (!audio || !isValid) return
    audio.volume = value
  }

  function onTimeUpdate() {
    props.onTimeUpdate?.(audioRef.current?.currentTime ?? 0)
  }

  function onDurationChange() {
    props.onDurationChange?.(audioRef.current?.duration ?? 0)
  }

  function onLoad() {
    props.playing && audioRef.current?.play()
    props.onLoad?.()
  }

  return (
    <audio
      ref={audioRef}
      hidden={props.hidden ?? false}
      onEnded={props.onEnd}
      onPlay={props.onPlay}
      onCanPlayThrough={onLoad}
      muted={props.mute}
      onTimeUpdate={onTimeUpdate}
      onDurationChange={onDurationChange}
    />
  )
})

export default Audio
