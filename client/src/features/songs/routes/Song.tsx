import DownloadIcon from '@mui/icons-material/Download'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import { formatDuration, getArtistUrlByName } from '@/helpers'
import { usePlayer } from '@/zustand/player'

import { apiSong } from '../api/songs'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import SongBanner from '../components/SongBanner'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import PlayButton from '@/features/player/components/PlayButton'
import NotFound from '@/NotFound'

export default function Song() {
  const { id } = useParams()
  const { playSong, play, activeSongId } = usePlayer()
  const { data, isLoading } = useQuery({
    queryKey: ['song', id],
    queryFn: () => apiSong.song(id ?? ''),
    enabled: !!id,
  })
  const songData = data?.data
  const { musicUrl, name, artist, image, show, duration, vote, timestamp } = songData ?? {}
  const { cover, thumbnail } = image ?? {}
  const isPlaying = id === activeSongId && play

  if (isLoading) return <Loading />

  if (!isLoading && !songData) return <NotFound />

  return (
    <Fragment>
      <PageHelmet title={name ?? 'Anime Song'} />

      <Stack gap={2}>
        <SongBanner
          category="Song"
          title={name}
          subtitle={artist ? <Link to={getArtistUrlByName(artist)}>{artist}</Link> : null}
          image={cover ?? thumbnail ?? ''}
          bgImage={thumbnail ?? cover ?? ''}
        />

        {songData && (
          <Fragment>
            <ControlsContainer>
              <PlayButton
                isPlaying={isPlaying}
                onClick={() => (isPlaying ? usePlayer.setState({ play: false }) : data && playSong(songData))}
              />

              <IconButton color="inherit" onClick={() => window.open(musicUrl)}>
                <DownloadIcon fontSize="medium" />
              </IconButton>

              {songData._id && <AddToPlaylistAction song={songData} />}
            </ControlsContainer>

            <Box paddingX={2}>
              {artist && (
                <Typography variant="body1">
                  Artist:{' '}
                  <Link style={{ color: 'inherit' }} to={getArtistUrlByName(artist)}>
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
          </Fragment>
        )}
      </Stack>
    </Fragment>
  )
}
