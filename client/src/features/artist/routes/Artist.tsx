import { List, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import Banner from '@/features/player/components/Banner'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import SongItem from '@/features/songs/components/SongItem'
import VoteAction from '@/features/songs/components/VoteAction'
import { getSongCover, getsongThumbnail } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { apiArtist } from '../api/artist'

export default function Artist() {
  const { id } = useParams()
  const { playPlaylist, activeSongId, id: playerId } = usePlayer()
  const { id: userId } = useUser()
  const { isLoading, data } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => apiArtist.get(id ?? ''),
    enabled: !!id,
  })
  const artist = data?.data
  const firstSong = artist?.songs?.[0]
  const isPlaylistPlaying = playerId === id
  const currentPlayingSong = isPlaylistPlaying ? artist?.songs?.find(a => a._id === activeSongId) : undefined
  const image = getSongCover(currentPlayingSong) ?? getSongCover(firstSong)
  const bgImage = getsongThumbnail(currentPlayingSong) ?? getsongThumbnail(firstSong)

  return (
    <>
      <Banner title={artist?.artist ?? ''} subtitle={currentPlayingSong?.name ?? ''} image={image} bgImage={bgImage} />
      {isLoading && <Loading />}
      {!isLoading && !artist?.artist && (
        <Typography p={2} variant="h6">
          Artist Not Found!
        </Typography>
      )}
      <List>
        {artist?.songs?.map(song => (
          <SongItem
            key={song._id}
            onClick={() => playPlaylist(id ?? 'artist-id', artist?.songs ?? [], song._id)}
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
    </>
  )
}
