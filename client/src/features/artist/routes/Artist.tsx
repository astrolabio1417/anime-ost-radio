import { List, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import PlayButton from '@/features/player/components/PlayButton'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import SongBanner from '@/features/songs/components/SongBanner'
import SongItem from '@/features/songs/components/SongItem'
import VoteAction from '@/features/songs/components/VoteAction'
import { getSongCover, getsongThumbnail, getSongUrlById } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { apiArtist } from '../api/artist'
import NotFound from '@/NotFound'

export default function Artist() {
  const { id } = useParams()
  const artistId = id ?? ''
  const { playPlaylist, activeSongId, id: playerId, play, playPlayer, pausePlayer } = usePlayer()
  const { id: userId } = useUser()
  const { isLoading, data: requestData } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => apiArtist.get(artistId),
    enabled: !!artistId,
  })
  const data = requestData?.data
  const firstSong = data?.songs?.[0]
  const isPlaylistPlaying = playerId === id
  const currentPlayingSong = isPlaylistPlaying ? data?.songs?.find(a => a._id === activeSongId) : undefined
  const image = getSongCover(currentPlayingSong) ?? getSongCover(firstSong)
  const bgImage = getsongThumbnail(currentPlayingSong) ?? getsongThumbnail(firstSong)

  function handlePlay() {
    if (isPlaylistPlaying) {
      play ? pausePlayer() : playPlayer()
      return
    }

    if (!data?.songs) return

    playPlaylist(artistId, [...data.songs], data.songs[0]._id)
    playPlayer()
  }

  if (isLoading) return <Loading />

  if (!isLoading && !data?.artist) return <NotFound />

  return (
    <Fragment>
      <PageHelmet title={data?.artist ?? 'Artist'} />

      <Stack gap={2}>
        <SongBanner
          category="Artist"
          title={data?.artist ?? ''}
          subtitle={
            !currentPlayingSong ? null : (
              <Link to={getSongUrlById(currentPlayingSong._id)}>{currentPlayingSong.name}</Link>
            )
          }
          image={image}
          bgImage={bgImage}
        />

        <ControlsContainer>
          <PlayButton isPlaying={isPlaylistPlaying && play} onClick={handlePlay} />
          {currentPlayingSong && <AddToPlaylistAction song={currentPlayingSong} />}
        </ControlsContainer>

        <List>
          {data?.songs?.map(song => (
            <SongItem
              key={song._id}
              onClick={() => playPlaylist(artistId ?? 'artist-id', data?.songs ?? [], song._id)}
              song={song}
              user={userId}
              secondaryAction={
                <Stack direction="row" gap={1}>
                  <AddToPlaylistAction song={song} />
                  <VoteAction song={song} />
                </Stack>
              }
            />
          ))}
        </List>
      </Stack>
    </Fragment>
  )
}
