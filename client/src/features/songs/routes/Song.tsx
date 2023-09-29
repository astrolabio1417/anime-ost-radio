import DownloadIcon from '@mui/icons-material/Download'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import Banner from '@/features/player/components/Banner'
import { formatDuration } from '@/helpers'
import { usePlayer } from '@/zustand/player'

import { apiSong } from '../api/songs'
import AddToPlaylistAction from '../components/AddToPlaylistAction'

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
      <PageHelmet title={name ?? 'Anime Song'} />

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
              <Button
                startIcon={<PauseIcon />}
                variant="text"
                color="inherit"
                onClick={() => usePlayer.setState({ play: false })}
              >
                Pause
              </Button>
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

          {artist && (
            <Typography variant="body1">
              Artist:{' '}
              <Link style={{ color: 'inherit' }} to={`/artists/${btoa(encodeURIComponent(artist))}`}>
                {artist}
              </Link>
            </Typography>
          )}
          {show && (
            <Typography variant="body1">
              Anime:{' '}
              <Link style={{ color: 'inherit' }} to={`/shows/${btoa(encodeURIComponent(show))}`}>
                {show}
              </Link>
            </Typography>
          )}
          {duration && <Typography variant="body1">Duration: {formatDuration(duration)}</Typography>}
          {timestamp && (
            <Typography variant="body1">Upload Date: {new Date(timestamp)?.toLocaleDateString()}</Typography>
          )}
          {vote?.total !== undefined && <Typography variant="body1">Votes: {vote.total}</Typography>}
        </Box>
      )}
    </Fragment>
  )
}
