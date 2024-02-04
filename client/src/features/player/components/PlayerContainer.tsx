import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { RADIO_STREAM } from '@/constants'
import { PlayerSongI, usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'

import { Player } from './Player'
import VoiceReceiver from './VoiceReceiver'

export default function PlayerContainer() {
  const [showMobilePlayer, setShowMobilePlayer] = useState(false)
  const { songs, activeSongId, play } = usePlayer()
  const isLive = useRadio(state => state.isLive)
  const currentRadioTrack = useRadio(state => state.current)
  const [volume, setVolume] = useState(1)

  const playlistSongs: PlayerSongI[] = !isLive
    ? songs
    : currentRadioTrack
      ? [
          {
            id: currentRadioTrack._id,
            image: currentRadioTrack.image.cover ?? currentRadioTrack.image.thumbnail ?? '',
            src: RADIO_STREAM,
            title: currentRadioTrack.name,
            subtitle: currentRadioTrack.artist,
            downloadUrl: currentRadioTrack.musicUrl,
          },
        ]
      : []
  const song = isLive ? playlistSongs[0] : playlistSongs.find(a => a.id === activeSongId)
  const initialIndex = isLive ? 0 : songs.findIndex(a => a.id === activeSongId) ?? 0

  useEffect(() => {
    if (!isLive || !currentRadioTrack?._id) return
    usePlayer.setState({ activeSongId: currentRadioTrack._id })
  }, [isLive, currentRadioTrack?._id])

  function onSongChange(song: PlayerSongI) {
    usePlayer.setState({ activeSongId: song.id })
  }

  function handleOnPlay(isPlaying: boolean) {
    usePlayer.setState({ play: isPlaying })
  }

  return (
    <Box sx={{ width: '100%', height: '100%', gridArea: 'playbar', overflow: 'hidden' }}>
      <Box
        height="60px"
        display={{ xs: 'flex', sm: 'none' }}
        bgcolor="#252525"
        width="100%"
        zIndex={10}
        sx={{ alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setShowMobilePlayer(true)}
      >
        <Box display="inline-block" width="60px" height="100%">
          <img src={song?.image ?? ''} height="100%" width="100%" />
        </Box>
        <Typography variant="body2" color="white" paddingX={1}>
          {song?.title}
        </Typography>
      </Box>

      <Box
        width="100%"
        height="100%"
        bottom={0}
        zIndex={1101}
        bgcolor="#252525"
        position={{ xs: 'absolute', sm: 'unset' }}
        visibility={{ xs: showMobilePlayer ? 'visible' : 'hidden', sm: 'visible' }}
        sx={{
          transform: {
            xs: `translateY(${showMobilePlayer ? '0%' : '100%'})`,
            sm: 'none',
          },
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'all 0.4s ease-in-out',
        }}
      >
        <Toolbar
          sx={{
            position: 'absolute',
            zIndex: 2,
            display: { sm: 'none' },
          }}
        >
          <IconButton title="Close" sx={{ color: 'white' }} size="large" onClick={() => setShowMobilePlayer(false)}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Toolbar>

        <Player
          onVolumeChange={setVolume}
          initialPlay={play}
          onSongChange={onSongChange}
          onPlayChange={handleOnPlay}
          songs={playlistSongs}
          initialIndex={initialIndex}
          isLive={isLive}
        />

        <VoiceReceiver volume={volume} disable={!(isLive && play)} />
      </Box>
    </Box>
  )
}
