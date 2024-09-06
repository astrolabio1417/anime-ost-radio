import { List, Stack } from '@mui/material'
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
import usePlayerHandler from '@/hooks/usePlayerHandler'
import NotFound from '@/NotFound'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { apiArtist } from '../api/artist'

export default function Artist() {
  const { id } = useParams()
  const artistId = id ?? ''
  const { currentSongId, isPlaying } = usePlayer()
  const { id: userId } = useUser()
  const { isLoading, data: requestData } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => apiArtist.get(artistId),
    enabled: !!artistId,
  })
  const data = requestData?.data
  const firstSong = data?.songs?.[0]
  const { togglePlay, isPlaylistPlaying, currentSong } = usePlayerHandler({
    title: data?.artist || 'Artist Songs',
    pageUrl: window.location.href,
    songs: data?.songs || [],
    playlistId: artistId,
  })

  if (isLoading) return <Loading />

  if (!isLoading && !data?.artist) return <NotFound />

  return (
    <Fragment>
      <PageHelmet title={data?.artist || 'Artist Song'} />

      <Stack gap={2}>
        <SongBanner
          category="Artist"
          title={data?.artist ?? ''}
          subtitle={!currentSong ? null : <Link to={getSongUrlById(currentSong._id)}>{currentSong.name}</Link>}
          image={getsongThumbnail(currentSong) || getsongThumbnail(firstSong)}
          bgImage={getSongCover(currentSong) || getSongCover(firstSong)}
        />

        <ControlsContainer>
          <PlayButton isPlaying={isPlaylistPlaying && isPlaying} onClick={togglePlay} />
          {currentSong && <AddToPlaylistAction song={currentSong} />}
        </ControlsContainer>

        <List>
          {data?.songs?.map(song => (
            <SongItem
              key={song._id}
              onClick={togglePlay}
              isPlaying={currentSongId === song._id && isPlaying}
              song={song}
              userId={userId}
              secondaryAction={
                <Stack direction="row">
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
