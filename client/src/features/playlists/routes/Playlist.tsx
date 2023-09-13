import { Box, Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import { ISong } from '@/features/songs/types'
import { getSongCover } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import Banner from '../../player/components/Banner'
import MusicSpectrumAnimation from '../../songs/components/MusicSpectrumAnimation'
import SongItem from '../../songs/components/SongItem'
import { getPlaylist } from '../api/playlist'
import RemoveSongAction from '../components/RemoveSongAction'
import { IPlaylist } from '../types'

export default function Playlist() {
  const { id } = useParams()
  const { data, isLoading } = useQuery<IPlaylist>({
    queryKey: ['playlist', id],
    queryFn: () => getPlaylist(id ?? ''),
  })
  const [deletedSong, setDeletedSong] = useState<string[]>([])
  const { id: userId } = useUser()
  const { activeSongId, id: playerId, playPlaylist, play } = usePlayer()

  const playlistSongs = data?.songs?.filter(s => !deletedSong.includes(s._id))
  const isPlaylistPlaying = playerId === id
  const currentPlayingSong = isPlaylistPlaying ? playlistSongs?.find(a => a._id === activeSongId) : undefined

  useEffect(() => {
    setDeletedSong([])
  }, [data])

  function handleDelete(song: ISong) {
    setDeletedSong(prev => [...prev, song._id])
  }

  return (
    <Box>
      <Banner
        title={data?.title ?? ''}
        subtitle={currentPlayingSong?.name ?? ''}
        bgImage={getSongCover(currentPlayingSong) ?? data?.image?.cover ?? ''}
        image={data?.image?.cover ?? ''}
      />

      {!isLoading && !data?._id && (
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
            onClick={() => playPlaylist(id ?? 'playlist-id', data?.songs ?? [], song._id)}
            secondaryAction={
              <Stack direction="row" gap={1}>
                {song._id === activeSongId && play && <MusicSpectrumAnimation />}
                <AddToPlaylistAction song={song} />
                {data?.user._id === userId && (
                  <RemoveSongAction playlistId={id ?? ''} song={song} onDelete={handleDelete} />
                )}
              </Stack>
            }
          />
        ))}
      </Stack>
    </Box>
  )
}
