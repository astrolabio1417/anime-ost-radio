import { Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import PlayButton from '@/features/player/components/PlayButton'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import SongBanner from '@/features/songs/components/SongBanner'
import { ISong } from '@/features/songs/types'
import { getSongCover, getsongThumbnail, getSongUrlById } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import SongItem from '../../songs/components/SongItem'
import { apiPlaylist } from '../api/playlist'
import RemoveSongAction from '../components/RemoveSongAction'
import NotFound from '@/NotFound'

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

  const playlistData = data?.data
  const playlistSongs = playlistData?.songs?.filter(s => !deletedSong.includes(s._id))
  const isPlaylistPlaying = playerId === playlistId
  const currentPlayingSong = isPlaylistPlaying ? playlistSongs?.find(a => a._id === activeSongId) : undefined

  useEffect(() => {
    setDeletedSong([])
  }, [playlistData])

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

  if (isLoading) return <Loading />

  if (!isLoading && !playlistData?._id) return <NotFound />

  return (
    <Fragment>
      <PageHelmet title={playlistData?.title ?? 'Playlist'} />

      <Stack gap={2}>
        <SongBanner
          category="Playlist"
          title={playlistData?.title}
          subtitle={
            currentPlayingSong ? (
              <Link to={getSongUrlById(currentPlayingSong._id)}>{currentPlayingSong.name}</Link>
            ) : null
          }
          bgImage={getSongCover(currentPlayingSong) || getSongCover(playlistData)}
          image={getsongThumbnail(playlistData) || getsongThumbnail(currentPlayingSong)}
        />

        <ControlsContainer>
          <PlayButton isPlaying={isPlaylistPlaying && play} onClick={handlePlay} />
          {currentPlayingSong && <AddToPlaylistAction song={currentPlayingSong} />}
        </ControlsContainer>

        <Stack divider={<Divider variant="fullWidth" />}>
          {playlistSongs?.map(song => (
            <SongItem
              key={song._id}
              song={song}
              onClick={() => playPlaylist(playlistId, [...playlistSongs], song._id)}
              secondaryAction={
                <Stack direction="row" gap={1}>
                  <AddToPlaylistAction song={song} />
                  {playlistData?.user._id === userId && (
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
