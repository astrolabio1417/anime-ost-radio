import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import BannerBackground from '@/assets/banner-background.png'
import { RADIO_PLAYLIST_ID } from '@/constants'
import { PlayerSongI, usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'

import { Player } from './Player'
import VoiceReceiver from './VoiceReceiver'

export default function PlayerContainer() {
  const [showMobilePlayer, setShowMobilePlayer] = useState(false)
  const { songs, isPlaying, getCurrentSong, getCurrentSongIndex, title, pageUrl } = usePlayer()
  const { isLive } = useRadio(state => state)
  const currentRadioTrack = useRadio(state => state.current)
  const [volume, setVolume] = useState(1)

  const currentSong = getCurrentSong()
  const currentSongIndex = getCurrentSongIndex()

  useEffect(() => {
    if (!isLive || !currentRadioTrack?._id) return
    const radioState = useRadio.getState()

    usePlayer.setState({
      currentSongId: currentRadioTrack._id,
      title: 'Live Radio',
      pageUrl: '/',
      id: RADIO_PLAYLIST_ID,
      songs: [radioState.parsedSong(), ...radioState.parsedSongs()],
    })
  }, [isLive, currentRadioTrack?._id])

  function onSongChange(song: PlayerSongI) {
    usePlayer.setState({ currentSongId: song.id })
  }

  function handleOnPlay(isPlaying: boolean) {
    usePlayer.setState({ isPlaying })
  }

  return (
    <Box overflow="hidden" width="100%" height="100%" gridArea="playbar">
      {/* small screen sticky playing card */}
      <Box
        height="60px"
        display={{ xs: 'flex', sm: 'none' }}
        bgcolor="#252525"
        paddingX={1}
        width="100%"
        zIndex={10}
        sx={{ alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setShowMobilePlayer(true)}
        color="white"
      >
        <Box display="inline-block" width="50px" height="50px" minWidth="50px" borderRadius={2} overflow="hidden">
          <img src={currentSong?.image ?? BannerBackground} height="100%" width="100%" />
        </Box>
        <Box paddingLeft={2}>
          <Typography lineHeight="1.2" variant="body1">
            {currentSong?.title}
          </Typography>
          <Typography variant="caption" className="line-clamp-1">
            {currentSong?.subtitle}
          </Typography>
        </Box>
      </Box>
      {/* big screen */}
      <Box
        width="100%"
        height="100%"
        bottom={0}
        zIndex={1101}
        bgcolor="#252525"
        position={{ xs: 'absolute', sm: 'unset' }}
        visibility={{ xs: showMobilePlayer ? 'visible' : 'hidden', sm: 'visible' }}
        sx={{
          transform: { xs: `translateY(${showMobilePlayer ? '0%' : '100%'})`, sm: 'none' },
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'all 0.4s ease-in-out',
        }}
      >
        <Box
          sx={{
            display: { sm: 'none' },
            position: 'absolute',
            top: 0,
            transform: 'translateX(-50%)',
            left: '50%',
            zIndex: 1102,
            width: '100%',
          }}
        >
          <IconButton
            title="Close"
            sx={{ color: 'white', width: '100%' }}
            size="large"
            onClick={() => setShowMobilePlayer(false)}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>

        <Player
          title={title || undefined}
          pageUrl={pageUrl || undefined}
          onVolumeChange={setVolume}
          initialPlay={isPlaying}
          onSongChange={onSongChange}
          onPlayChange={handleOnPlay}
          songs={songs}
          initialIndex={currentSongIndex}
          isLive={isLive}
        />

        <VoiceReceiver volume={volume} disable={!(isLive && isPlaying)} />
      </Box>
    </Box>
  )
}
