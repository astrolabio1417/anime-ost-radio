import { Divider, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import PlayButton from '@/features/player/components/PlayButton'
import { apiShow } from '@/features/show/api/show'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import SongBanner from '@/features/songs/components/SongBanner'
import VoteAction from '@/features/songs/components/VoteAction'
import { getSongCover, getsongThumbnail, getSongUrlById } from '@/helpers'
import usePlayerHandler from '@/hooks/usePlayerHandler'
import NotFound from '@/NotFound'

import SongItem from '../../songs/components/SongItem'

export default function Show() {
  const { id } = useParams()
  const showId = id ?? ''
  const { data, isLoading } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => apiShow.get(showId),
  })
  const songs = data?.data.songs ?? []
  const { togglePlay, isPlaylistPlaying, currentSong } = usePlayerHandler({
    pageUrl: window.location.href,
    songs,
    title: data?.data.show || 'Show Songs',
    playlistId: showId,
  })

  if (isLoading) return <Loading />

  if (!isLoading && !data?.data?.show) return <NotFound />

  return (
    <Fragment>
      <PageHelmet title={`${data?.data.show ?? 'Anime Songs'}`} />

      <Stack gap={2}>
        <SongBanner
          title={data?.data?.show ?? ''}
          subtitle={currentSong ? <Link to={getSongUrlById(currentSong._id)}>{currentSong.name}</Link> : null}
          category="Show"
          bgImage={getSongCover(currentSong)}
          image={getsongThumbnail(currentSong)}
        />

        <ControlsContainer>
          <PlayButton isPlaying={isPlaylistPlaying} onClick={togglePlay} />
          {currentSong && <AddToPlaylistAction song={currentSong} />}
        </ControlsContainer>

        <Stack divider={<Divider variant="fullWidth" />}>
          {songs.map(song => (
            <SongItem
              key={song._id}
              song={song}
              onClick={togglePlay}
              isPlaying={currentSong?._id === song._id}
              secondaryAction={
                <Stack direction="row">
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
