import { Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import BannerButtonsContainer from '@/features/player/components/BannerButtonsContainer'
import BannerPlayButton from '@/features/player/components/BannerPlayButton'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import { ISong } from '@/features/songs/types'
import { getSongCover, getsongThumbnail } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import Banner from '../../player/components/Banner'
import SongItem from '../../songs/components/SongItem'
import { apiPlaylist } from '../api/playlist'
import RemoveSongAction from '../components/RemoveSongAction'

export default function Playlist() {
  const { id } = useParams()
  const playlistId = id ?? ''
  const { data, isLoading } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => apiPlaylist.get(playlistId),
  })
  const [deletedSong, setDeletedSong] = useState<string[]>([])
  const { id: userId } = useUser()
  const { activeSongId, id: playerId, playPlaylist, play, playPlayer, pausePlayer } = usePlayer()

  const playlist = data?.data
  const playlistSongs = playlist?.songs?.filter(s => !deletedSong.includes(s._id))
  const isPlaylistPlaying = playerId === playlistId
  const currentPlayingSong = isPlaylistPlaying ? playlistSongs?.find(a => a._id === activeSongId) : undefined

  useEffect(() => {
    setDeletedSong([])
  }, [playlist])

  function handleDelete(song: ISong) {
    setDeletedSong(prev => [...prev, song._id])
  }

  function handlePlay() {
    if (isPlaylistPlaying) {
      play ? pausePlayer() : playPlayer()
      return
    }

    if (!playlistSongs) return
    playPlaylist(playlistId, [...playlistSongs], playlistSongs[0]._id)
  }

  return (
    <Fragment>
      <PageHelmet title={playlist?.title ?? 'Playlist'} />

      <Stack gap={2}>
        <Banner
          title={playlist?.title || ''}
          subtitle={currentPlayingSong?.name || ''}
          bgImage={getSongCover(currentPlayingSong) || getSongCover(playlist)}
          image={getsongThumbnail(playlist) || getsongThumbnail(currentPlayingSong)}
        />

        <BannerButtonsContainer>
          <BannerPlayButton isPlaying={isPlaylistPlaying && play} onClick={handlePlay} />
          {currentPlayingSong && <AddToPlaylistAction song={currentPlayingSong} />}
        </BannerButtonsContainer>

        {!isLoading && !playlist?._id && (
          <Typography p={2} variant="h6">
            Playlist Not Found!
          </Typography>
        )}

        {isLoading && <Loading />}

        <Stack divider={<Divider variant="fullWidth" />}>
          {playlistSongs?.map(song => (
            <SongItem
              key={song._id}
              song={song}
              onClick={() => playPlaylist(playlistId, [...playlistSongs], song._id)}
              secondaryAction={
                <Stack direction="row" gap={1}>
                  <AddToPlaylistAction song={song} />
                  {playlist?.user._id === userId && (
                    <RemoveSongAction playlistId={playlistId} song={song} onDelete={handleDelete} />
                  )}
                </Stack>
              }
            />
          ))}
        </Stack>
      </Stack>
    </Fragment>
  )
}
