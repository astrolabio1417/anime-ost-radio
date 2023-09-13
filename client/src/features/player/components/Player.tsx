import DownloadIcon from '@mui/icons-material/Download'
import LoopIcon from '@mui/icons-material/Loop'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import { Box, IconButton, Slider, Stack, Typography } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'

import { formatSeek } from '@/helpers'
import useWidthSize from '@/hooks/useWidthSize'
import { PlayerSongI } from '@/zustand/player'

import Audio, { AudioHandle } from './Audio'
import LiveText from './LiveText'
import PlayerCard from './PlayerCard'
import Volume from './Volume'

interface PlayerProps {
  songs: PlayerSongI[]
  initialIndex?: number
  initialPlay?: boolean
  onSongChange?: (song: PlayerSongI) => void
  onPlayChange?: (isPlaying: boolean) => void
}

export function Player(props: PlayerProps) {
  const { songs, initialIndex, onSongChange, initialPlay, onPlayChange } = props
  const audioRef = useRef<AudioHandle>(null)
  const [index, setIndex] = useState(initialIndex ?? 0)
  const current = index !== undefined ? props.songs?.[index] : null
  const downloadUrl = current?.downloadUrl ?? current?.src
  const [playerState, setPlayerState] = useState({
    play: true,
    loop: false,
    isSeeking: false,
    mute: false,
    duration: 0,
    seek: 0,
    volume: 1,
  })

  useEffect(() => {
    setPlayerState(prev => ({ ...prev, play: !!initialPlay }))
  }, [initialPlay])

  useEffect(() => {
    setIndex(initialIndex ?? 0)
  }, [initialIndex, props.songs])

  const handleOnPlay = () => setPlayerState(prev => ({ ...prev, play: true }))
  const handleMute = () => setPlayerState(prev => ({ ...prev, mute: !audioRef.current?.muted }))
  const toggleLoop = () => setPlayerState(prev => ({ ...prev, loop: !prev.loop }))
  const handleDurationChange = (duration: number) => setPlayerState(prev => ({ ...prev, duration }))
  const handleTimeChange = (seek: number) => !playerState.isSeeking && setPlayerState(prev => ({ ...prev, seek }))

  const handleVolumeChange = (_: Event, newVolume: number | number[]) => {
    setPlayerState(prev => ({ ...prev, volume: Array.isArray(newVolume) ? newVolume[0] : newVolume, mute: false }))
  }

  const handleOnSeek = (_: Event, newSeek: number | number[]) => {
    setPlayerState(prev => ({ ...prev, isSeeking: true, seek: Array.isArray(newSeek) ? newSeek[0] : newSeek }))
  }

  function playNext() {
    const lastIndex = props.songs.length - 1
    const isLastSong = index === lastIndex
    const nextIndex = isLastSong ? 0 : index + 1

    if (isLastSong && !playerState.loop) return
    if (props.songs.length === 1) return audioRef.current?.play()

    setIndex(nextIndex)
    onSongChange?.(props.songs[nextIndex])
  }

  function playPrev() {
    const nextIndex = index !== 0 ? index - 1 : 0
    setIndex(nextIndex)
    onSongChange?.(props.songs[nextIndex])
  }

  function handlePlayPause() {
    onPlayChange?.(!playerState.play)
    setPlayerState(prev => ({ ...prev, play: !prev.play }))
    playerState.play ? audioRef.current?.pause() : audioRef.current?.play()
  }

  function handleOnSeekCommitted() {
    audioRef.current?.seek(playerState.seek ?? 0)
    setPlayerState(prev => ({ ...prev, isSeeking: false }))
  }

  const { windowWidth } = useWidthSize()

  return (
    <Fragment>
      <Audio
        src={current?.src ?? ''}
        ref={audioRef}
        onEnd={playNext}
        onPlay={handleOnPlay}
        playing={playerState.play}
        volume={playerState.volume}
        mute={playerState.mute}
        onDurationChange={handleDurationChange}
        onTimeUpdate={handleTimeChange}
      />

      <Stack
        width="100%"
        height="inherit"
        bgcolor="#252525"
        overflow="hidden"
        direction="row"
        flexWrap="wrap"
        paddingX={2}
        paddingY={1}
        justifyContent="space-between"
        alignItems="center"
        color="white"
        gap={2}
      >
        <Box position="relative" overflow="hidden" width={{ xs: '100%', md: '20%' }}>
          <PlayerCard
            title={current?.title ?? ''}
            subtitle={current?.subtitle ?? ''}
            image={current?.image ?? ''}
            imageSize={windowWidth >= 900 ? 56 : '50vh'}
            titleSize={windowWidth >= 900 ? 15 : 24}
            subtitleSize={windowWidth >= 900 ? 10 : 20}
            alignItems="center"
            titleLineClamp={windowWidth >= 900 ? 1 : 4}
            subtitleLineClamp={windowWidth >= 900 ? 1 : 4}
          />
        </Box>

        <Stack alignItems="center" width={{ xs: '100%', md: '50%' }}>
          {/* player buttons  */}
          <Stack direction="row" alignItems="center" width="100%">
            {/* left */}
            <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
              <IconButton title="Loop" onClick={toggleLoop} color={playerState.loop ? 'primary' : 'inherit'}>
                <LoopIcon fontSize="small" />
              </IconButton>
              <IconButton
                title="Previous"
                disabled={index === 0}
                onClick={playPrev}
                color="inherit"
                sx={{ ':disabled': { color: 'rgb(255,255,255,0.5)' } }}
              >
                <SkipPreviousIcon fontSize="medium" />
              </IconButton>
            </Stack>
            <IconButton title="Play" color="inherit" onClick={handlePlayPause}>
              {playerState.play ? (
                <PauseCircleOutlineIcon fontSize="large" />
              ) : (
                <PlayCircleOutlineIcon fontSize="large" />
              )}
            </IconButton>
            {/* right */}
            <Stack direction="row" gap={1} width="100%">
              <IconButton
                title="Next"
                disabled={songs.length === 1 ? true : index === songs.length - 1 && !playerState.loop}
                onClick={playNext}
                color="inherit"
                sx={{ ':disabled': { color: 'rgb(255,255,255,0.5)' } }}
              >
                <SkipNextIcon fontSize="medium" />
              </IconButton>
              <a href={downloadUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }} download>
                <IconButton title="Download" color="inherit">
                  <DownloadIcon fontSize="medium" />
                </IconButton>
              </a>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" width="100%" gap={2}>
            <Typography variant="body2">{formatSeek(playerState.seek ?? 0)}</Typography>
            <Slider
              disabled={playerState.duration === Infinity}
              step={1}
              value={playerState.seek ?? 0}
              max={playerState.duration ?? 0}
              onChange={handleOnSeek}
              onChangeCommitted={handleOnSeekCommitted}
              color="primary"
            />
            <Typography variant="body2">
              {playerState.duration === Infinity ? (
                <LiveText onClick={() => audioRef.current?.seekToBufferedEnd()} />
              ) : (
                formatSeek(playerState.duration ?? 0)
              )}
            </Typography>
          </Stack>
        </Stack>

        <Box
          width="20%"
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
          }}
        >
          <Box width="100%" maxWidth="200px" marginLeft="auto">
            <Volume
              volume={audioRef.current?.muted ? 0 : playerState.volume}
              onClick={handleMute}
              onChange={handleVolumeChange}
            />
          </Box>
        </Box>
      </Stack>
    </Fragment>
  )
}
