import { Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import PlayButton from '@/features/player/components/PlayButton'
import { apiShow } from '@/features/show/api/show'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import VoteAction from '@/features/songs/components/VoteAction'
import { getSongCover, getsongThumbnail } from '@/helpers'
import { usePlayer } from '@/zustand/player'

import Banner from '../../player/components/Banner'
import SongItem from '../../songs/components/SongItem'

export default function Show() {
  const { id } = useParams()
  const showId = id ?? ''
  const { data, isLoading } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => apiShow.get(showId),
  })
  const { activeSongId, id: playerId, playPlaylist, playPlayer, pausePlayer, play } = usePlayer()
  const songs = data?.data.songs
  const isPlaylistPlaying = playerId === showId
  const currentPlayingSong = isPlaylistPlaying ? songs?.find(a => a._id === activeSongId) : undefined
  const showCover = getSongCover(currentPlayingSong)
  const showThumbnail = getsongThumbnail(currentPlayingSong)

  function handlePlay() {
    if (isPlaylistPlaying) {
      play ? pausePlayer() : playPlayer()
      return
    }

    if (!songs) return

    playPlaylist(showId, [...songs], songs[0]._id)
    playPlayer()
  }

  return (
    <Fragment>
      <PageHelmet title={`${data?.data.show ?? 'Anime Songs'}`} />

      <Stack gap={2}>
        <Banner
          title={data?.data?.show ?? ''}
          subtitle={currentPlayingSong?.name ?? ''}
          bgImage={showCover}
          image={showThumbnail}
        />

        {!isLoading && !data?.data?.show && (
          <Typography p={2} variant="h6">
            Show Not Found!
          </Typography>
        )}

        {isLoading && <Loading />}

        <ControlsContainer>
          <PlayButton isPlaying={isPlaylistPlaying && play} onClick={handlePlay} />
          {currentPlayingSong && <AddToPlaylistAction song={currentPlayingSong} />}
        </ControlsContainer>

        <Stack divider={<Divider variant="fullWidth" />}>
          {songs?.map(song => (
            <SongItem
              key={song._id}
              song={song}
              onClick={() => playPlaylist(showId, [...songs], song._id)}
              secondaryAction={
                <Stack direction="row" gap={1}>
                  <AddToPlaylistAction song={song} />
                  <VoteAction song={song} />
                </Stack>
              }
            />
          ))}
        </Stack>
      </Stack>
    </Fragment>
  )
}
