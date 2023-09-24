import { Box, Divider, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import { apiShow } from '@/features/show/api/show'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import VoteAction from '@/features/songs/components/VoteAction'
import { getSongCover } from '@/helpers'
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
  const { activeSongId, id: playerId, playPlaylist } = usePlayer()
  const songs = data?.data.songs
  const isPlaylistPlaying = playerId === showId
  const currentPlayingSong = isPlaylistPlaying ? songs?.find(a => a._id === activeSongId) : undefined
  const showImage = getSongCover(currentPlayingSong) ?? ''

  return (
    <Box>
      <Banner
        title={data?.data?.show ?? ''}
        subtitle={currentPlayingSong?.name ?? ''}
        bgImage={showImage}
        image={showImage}
      />

      {!isLoading && !data?.data?.show && (
        <Typography p={2} variant="h6">
          Show Not Found!
        </Typography>
      )}

      {isLoading && <Loading />}

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
    </Box>
  )
}
