import { Delete } from '@mui/icons-material'
import DownloadIcon from '@mui/icons-material/Download'
import { Box, IconButton, Modal, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import ModalContainer from '@/components/ModalContainer'
import PageHelmet from '@/components/PageHelmet'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import PlayButton from '@/features/player/components/PlayButton'
import { formatDuration, getArtistUrlByName, getSongCover, getsongThumbnail } from '@/helpers'
import NotFound from '@/NotFound'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { apiSong } from '../api/songs'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import DeleteSongForm from '../components/DeleteForm'
import SongBanner from '../components/SongBanner'
import VoteAction from '../components/VoteAction'

export default function Song() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const roles = useUser(state => state.roles)
  const isAdmin = !!roles.find(role => role.name === 'admin')
  const { id } = useParams()
  const { currentSongId, pause, isPlaying: isCurrentlyPlaying } = usePlayer()
  const { data, isLoading } = useQuery({
    queryKey: ['song', id],
    queryFn: () => apiSong.song(id ?? ''),
    enabled: !!id,
  })
  const song = data?.data
  const { musicUrl, name, artist, image, show, duration, timestamp } = song ?? {}
  const { cover, thumbnail } = image ?? {}
  const isPlaying = id === currentSongId && isCurrentlyPlaying

  if (isLoading) return <Loading />

  if (!isLoading && !song) return <NotFound />

  function handlePlay() {
    if (isPlaying || !song) return pause()
    usePlayer.getState().playSongs({
      songs: [
        {
          id: song._id,
          image: getsongThumbnail(song) || getSongCover(song) || '',
          src: song.musicUrl,
          title: song.name,
          subtitle: song.artist,
        },
      ],
      currentSongId: song._id,
      playerId: song._id,
    })
  }

  function handleClose() {
    setShowDeleteModal(false)
  }

  return (
    <Fragment>
      <PageHelmet title={name ?? 'Anime Song'} />

      <Stack gap={2}>
        <SongBanner
          category="Song"
          title={name}
          subtitle={artist ? <Link to={getArtistUrlByName(artist)}>{artist}</Link> : null}
          image={thumbnail ?? cover ?? ''}
          bgImage={cover ?? thumbnail ?? ''}
        />

        {song && (
          <Fragment>
            <ControlsContainer>
              <PlayButton isPlaying={isPlaying} onClick={handlePlay} />

              <VoteAction song={song} />

              {song._id && <AddToPlaylistAction song={song} />}

              <IconButton color="inherit" onClick={() => window.open(musicUrl)}>
                <DownloadIcon fontSize="medium" />
              </IconButton>

              {isAdmin && (
                <IconButton color="inherit" onClick={() => setShowDeleteModal(prev => !prev)}>
                  <Delete />
                </IconButton>
              )}
            </ControlsContainer>

            {isAdmin && (
              <Modal onClose={handleClose} open={showDeleteModal}>
                <ModalContainer>
                  <DeleteSongForm songId={song._id} onClose={handleClose} />
                </ModalContainer>
              </Modal>
            )}

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
            </Box>
          </Fragment>
        )}
      </Stack>
    </Fragment>
  )
}
