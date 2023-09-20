import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { DRAWER_WIDTH, RADIO_STREAM } from '@/constants'
import { PlayerSongI, usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'

import { Player } from '../components/Player'
import RadioVoice from '../components/RadioVoice'

export default function PlayerContainer() {
  const [showMobilePlayer, setShowMobilePlayer] = useState(false)
  const { songs, activeSongId, play } = usePlayer()
  const { isLive, current } = useRadio()

  const playlistSongs: PlayerSongI[] = !isLive
    ? songs
    : current
    ? [
        {
          id: current._id,
          image: current.image.cover ?? current.image.thumbnail ?? '',
          src: RADIO_STREAM,
          title: current.name,
          subtitle: current.artist,
          downloadUrl: current.musicUrl,
        },
      ]
    : []
  const song = isLive ? playlistSongs[0] : playlistSongs.find(a => a.id === activeSongId)
  const initialIndex = isLive ? 0 : songs.findIndex(a => a.id === activeSongId) ?? 0

  useEffect(() => {
    if (!isLive) return
    usePlayer.setState({
      activeSongId: current._id,
    })
  }, [isLive, current])

  function onSongChange(song: PlayerSongI) {
    usePlayer.setState({ activeSongId: song.id })
  }

  function handleOnPlay(isPlaying: boolean) {
    usePlayer.setState({ play: isPlaying })
  }

  return (
    <Box display={song ? 'block' : 'none'}>
      <Box
        height="60px"
        position="fixed"
        display={{
          xs: 'flex',
          md: 'none',
        }}
        bottom={0}
        bgcolor="#252525"
        width="100%"
        zIndex={10}
        sx={{
          alignItems: 'center',
          cursor: 'pointer',
        }}
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
        position="fixed"
        width={{
          xs: '100%',
          md: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
        height={{
          xs: '100%',
          md: 'auto',
        }}
        bottom={0}
        zIndex={1101}
        bgcolor="#252525"
        sx={{
          overflowY: 'auto',
          transform: {
            xs: `translateY(${showMobilePlayer ? '0%' : '100%'})`,
            md: 'none',
          },
          transition: 'transform 0.4s ease-in-out',
        }}
      >
        <Toolbar
          sx={{
            position: 'fixed',
            display: {
              md: 'none',
            },
          }}
        >
          <IconButton title="Close" sx={{ color: 'white' }} size="large" onClick={() => setShowMobilePlayer(false)}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Toolbar>
        <Player
          initialPlay={play}
          onSongChange={onSongChange}
          onPlayChange={handleOnPlay}
          songs={playlistSongs}
          initialIndex={initialIndex}
        />
        <RadioVoice />
      </Box>
    </Box>
  )
}
