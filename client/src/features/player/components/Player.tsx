import { QueueMusic, Repeat } from '@mui/icons-material'
import DownloadIcon from '@mui/icons-material/Download'
import PauseRounded from '@mui/icons-material/PauseRounded'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import { Box, IconButton, Modal, Slider, Stack, Typography } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'

import ModalContainer from '@/components/ModalContainer'
import { formatSeek } from '@/helpers'
import { PlayerSongI } from '@/zustand/player'

import { SliderMainStyle } from '../style'
import Audio, { AudioHandle } from './Audio'
import LiveText from './LiveText'
import PlayerCard from './PlayerCard'
import PlayerSongList from './PlayerSongList'
import Volume from './Volume'

interface PlayerAdditionalProps {
  pageUrl?: string
  title?: string
}

interface PlayerProps extends PlayerAdditionalProps {
  songs: PlayerSongI[]
  isLive?: boolean
  initialIndex?: number
  initialPlay?: boolean
  onSongChange?: (song: PlayerSongI) => void
  onPlayChange?: (isPlaying: boolean) => void
  onVolumeChange?: (volume: number) => void
  play?: boolean
}

export function Player(props: PlayerProps) {
  const { songs, initialIndex, onSongChange, initialPlay, onPlayChange, play, title, pageUrl } = props
  const [showList, setShowList] = useState(false)
  const audioRef = useRef<AudioHandle>(null)
  const [index, setIndex] = useState(initialIndex ?? 0)
  const [playerState, setPlayerState] = useState({
    play: false,
    loop: false,
    isSeeking: false,
    mute: false,
    duration: 0,
    seek: 0,
    volume: 1,
  })
  const current = index !== undefined ? props.songs?.[index] : null
  const downloadUrl = current?.downloadUrl ?? current?.src

  useEffect(() => {
    if (play === undefined) return
    const audio = audioRef.current
    if (!audio) return
    play ? audio.play() : audio.pause()
  }, [play])

  useEffect(() => setPlayerState(prev => ({ ...prev, play: !!initialPlay })), [initialPlay])
  useEffect(() => setIndex(initialIndex ?? 0), [initialIndex, props.songs])

  const handleOnPlay = () => setPlayerState(prev => ({ ...prev, play: true }))
  const handleMute = () => setPlayerState(prev => ({ ...prev, mute: !audioRef.current?.muted }))
  const toggleLoop = () => setPlayerState(prev => ({ ...prev, loop: !prev.loop }))
  const handleDurationChange = (duration: number) => setPlayerState(prev => ({ ...prev, duration }))
  const handleTimeChange = (seek: number) => !playerState.isSeeking && setPlayerState(prev => ({ ...prev, seek }))

  const handleVolumeChange = (_: Event, newVolume: number | number[]) => {
    const volume = Array.isArray(newVolume) ? newVolume[0] : newVolume
    setPlayerState(prev => ({ ...prev, volume, mute: false }))
    props.onVolumeChange?.(volume)
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

  return (
    <Fragment>
      <Audio
        hls={props.isLive}
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
        position="relative"
        width="100%"
        height="inherit"
        bgcolor="#252525"
        direction="row"
        flexWrap="wrap"
        paddingX={2}
        paddingY={1}
        justifyContent={{ xs: 'center', md: 'space-between' }}
        alignItems="center"
        alignContent="center"
        gap={{ xs: 5, sm: 0 }}
        color="white"
        sx={{ overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Box position="relative" overflow="hidden" width={{ xs: '100%', md: '20%' }}>
          <PlayerCard title={current?.title ?? ''} subtitle={current?.subtitle ?? ''} image={current?.image ?? ''} />
        </Box>

        <Stack alignItems="center" width={{ xs: '100%', md: '50%' }}>
          {/* controls  */}
          <Stack direction="row" alignItems="center" width="100%" paddingY={0}>
            {/* left controls */}
            <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
              <IconButton
                disabled={props.isLive}
                title="Loop"
                onClick={toggleLoop}
                color={playerState.loop ? 'primary' : 'inherit'}
              >
                <Repeat fontSize="small" />
              </IconButton>
              <IconButton
                title="Previous"
                disabled={props.isLive || index === 0}
                onClick={playPrev}
                color="inherit"
                sx={{ ':disabled': { color: 'rgb(255,255,255,0.5)' } }}
              >
                <SkipPreviousIcon fontSize="small" />
              </IconButton>
            </Stack>

            <IconButton title="Play" color="inherit" onClick={handlePlayPause}>
              {playerState.play ? <PauseRounded fontSize="medium" /> : <PlayArrowRounded fontSize="medium" />}
            </IconButton>

            {/* right controls */}
            <Stack direction="row" gap={1} width="100%">
              <IconButton
                title="Next"
                disabled={props.isLive || songs.length === 1 ? true : index === songs.length - 1 && !playerState.loop}
                onClick={playNext}
                color="inherit"
                sx={{ ':disabled': { color: 'rgb(255,255,255,0.5)' } }}
              >
                <SkipNextIcon fontSize="small" />
              </IconButton>
              <a href={downloadUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }} download>
                <IconButton title="Download" color="inherit">
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </a>

              {songs?.length ? (
                <IconButton onClick={() => setShowList(true)} title="Music List" color="inherit">
                  <QueueMusic fontSize="small" />
                </IconButton>
              ) : undefined}
            </Stack>
          </Stack>

          <Box width="100%" paddingBottom="-50px">
            <Slider
              sx={{ ...SliderMainStyle }}
              disabled={playerState.duration === Infinity}
              step={1}
              value={playerState.seek ?? 0}
              max={playerState.duration ?? 0}
              onChange={handleOnSeek}
              onChangeCommitted={handleOnSeekCommitted}
              color="primary"
            />
            <Stack
              display="flex"
              justifyContent="space-between"
              alignContent="space-between"
              width="100%"
              flexDirection="row"
              sx={{ transform: 'translateY(-0.8rem)' }}
            >
              <Typography variant="caption">{formatSeek(playerState.seek ?? 0)}</Typography>
              <Typography variant="caption">{!props.isLive && formatSeek(playerState.duration ?? 0)}</Typography>
              {props.isLive && <LiveText onClick={() => audioRef.current?.seekToBufferedEnd()} />}
            </Stack>
          </Box>
        </Stack>

        <Box display={{ xs: 'none', md: 'block' }} width={{ xs: '50%', md: '20%' }}>
          <Box width="100%" maxWidth={{ xs: '100%', md: '150px' }} marginLeft="auto">
            <Volume
              volume={audioRef.current?.muted ? 0 : playerState.volume}
              onClick={handleMute}
              onChange={handleVolumeChange}
            />
          </Box>
        </Box>
      </Stack>

      <Modal open={showList} onClose={() => setShowList(prev => !prev)}>
        <ModalContainer onClose={() => setShowList(prev => !prev)} sx={{ maxWidth: '600px' }}>
          <PlayerSongList
            disable={!!props.isLive}
            title={title}
            pageUrl={pageUrl}
            songPlayingIndex={index}
            songs={songs}
            onSongChange={onSongChange}
          />
        </ModalContainer>
      </Modal>
    </Fragment>
  )
}
