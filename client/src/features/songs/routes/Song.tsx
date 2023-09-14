import DownloadIcon from '@mui/icons-material/Download'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import Banner from '@/features/player/components/Banner'
import { usePlayer } from '@/zustand/player'

import { apiSong } from '../api/songs'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import MusicSpectrumAnimation from '../components/MusicSpectrumAnimation'

export default function Song() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['song', id],
    queryFn: () => apiSong.song(id ?? ''),
    enabled: !!id,
  })
  const { playSong, play, activeSongId } = usePlayer()

  const song = data?.data
  const { musicUrl, name, artist, image, show, duration, vote, timestamp } = song ?? {}
  const { cover, thumbnail } = image ?? {}

  return (
    <Fragment>
      <Banner
        title={name ?? ''}
        subtitle={artist ?? ''}
        image={cover ?? thumbnail ?? ''}
        bgImage={thumbnail ?? cover ?? ''}
      />
      {isLoading && <Loading />}

      {song && (
        <Box padding={2}>
          <Stack direction="row" flexWrap="wrap" gap={2} pb={5}>
            {id === activeSongId && play ? (
              <>
                <Box paddingTop={1}>
                  <MusicSpectrumAnimation />
                </Box>
                <Button
                  startIcon={<PauseIcon />}
                  variant="text"
                  color="inherit"
                  onClick={() => usePlayer.setState({ play: false })}
                >
                  Pause
                </Button>
              </>
            ) : (
              <Button
                startIcon={<PlayArrowIcon />}
                variant="text"
                color="inherit"
                onClick={() => data && playSong(song)}
              >
                Play
              </Button>
            )}
            <Button
              color="inherit"
              onClick={() => musicUrl?.startsWith('https://') && window.open(musicUrl, '_blank')}
              startIcon={<DownloadIcon />}
              variant="text"
            >
              Download MP3
            </Button>
            {song._id && <AddToPlaylistAction song={song} />}
          </Stack>

          {artist && <Typography variant="body1">Artist: {artist}</Typography>}
          {duration && <Typography variant="body1">Duration: {duration}</Typography>}
          {show?.name && <Typography variant="body1">Anime: {show.name}</Typography>}
          {timestamp && (
            <Typography variant="body1">Upload Date: {new Date(timestamp)?.toLocaleDateString()}</Typography>
          )}
          {vote?.total !== undefined && <Typography variant="body1">Votes: {vote.total}</Typography>}
        </Box>
      )}
    </Fragment>
  )
}
