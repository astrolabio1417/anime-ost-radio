import { List, Stack, Typography } from '@mui/material'
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
import usePlayerHandler from '@/hooks/usePlayerHandler'
import NotFound from '@/NotFound'
import { useUser } from '@/zustand/user'

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
  const playlistData = data?.data
  const playlistSongs = playlistData?.songs?.filter(s => !deletedSong.includes(s._id)) || []
  const { togglePlay, isPlaylistPlaying, currentSong } = usePlayerHandler({
    title: playlistData?.title || 'Playlist Songs',
    pageUrl: window.location.href,
    songs: playlistSongs,
    playlistId,
  })

  useEffect(() => {
    setDeletedSong([])
  }, [playlistData])

  function handleDelete(song: ISong) {
    setDeletedSong(prev => [...prev, song._id])
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
          subtitle={currentSong ? <Link to={getSongUrlById(currentSong._id)}>{currentSong.name}</Link> : null}
          bgImage={getSongCover(currentSong) || getSongCover(playlistData)}
          image={getsongThumbnail(playlistData) || getsongThumbnail(currentSong)}
        />

        <ControlsContainer>
          <PlayButton isPlaying={isPlaylistPlaying} onClick={togglePlay} />
          {currentSong && <AddToPlaylistAction song={currentSong} />}
        </ControlsContainer>

        {playlistSongs?.length ? (
          <List>
            {playlistSongs.map(song => (
              <SongItem
                key={song._id}
                song={song}
                onClick={togglePlay}
                isPlaying={isPlaylistPlaying && song._id === currentSong?._id}
                secondaryAction={
                  <Stack direction="row">
                    <AddToPlaylistAction song={song} />
                    {playlistData?.user._id === userId && (
                      <RemoveSongAction playlistId={playlistId} song={song} onDelete={handleDelete} />
                    )}
                  </Stack>
                }
              />
            ))}
          </List>
        ) : (
          <Typography px={2}>No songs available</Typography>
        )}
      </Stack>
    </Fragment>
  )
}
