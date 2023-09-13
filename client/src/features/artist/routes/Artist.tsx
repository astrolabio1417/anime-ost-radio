import { List, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import Banner from '@/features/player/components/Banner'
import AddToPlaylistAction from '@/features/songs/components/AddToPlaylistAction'
import MusicSpectrumAnimation from '@/features/songs/components/MusicSpectrumAnimation'
import SongItem from '@/features/songs/components/SongItem'
import VoteAction from '@/features/songs/components/VoteAction'
import { getSongCover, getsongThumbnail } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { getArtist } from '../api/artist'

export default function Artist() {
  const { id } = useParams()
  const { playPlaylist, activeSongId, play, id: playerId } = usePlayer()
  const { id: userId } = useUser()
  const { isLoading, data } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtist(id ?? ''),
    enabled: !!id,
  })

  const firstSong = data?.songs?.[0]
  const isPlaylistPlaying = playerId === id
  const currentPlayingSong = isPlaylistPlaying ? data?.songs?.find(a => a._id === activeSongId) : undefined
  const image = getSongCover(currentPlayingSong) ?? getSongCover(firstSong)
  const bgImage = getsongThumbnail(currentPlayingSong) ?? getsongThumbnail(firstSong)

  console.log({ currentPlayingSong })

  return (
    <>
      <Banner title={data?.artist ?? ''} subtitle={currentPlayingSong?.name ?? ''} image={image} bgImage={bgImage} />
      {isLoading && <Loading />}
      {!isLoading && !data?.artist && (
        <Typography p={2} variant="h6">
          Artist Not Found!
        </Typography>
      )}
      <List>
        {data?.songs?.map(song => (
          <SongItem
            key={song._id}
            onClick={() => playPlaylist(id ?? 'artist-id', data?.songs ?? [], song._id)}
            song={song}
            user={userId}
            secondaryAction={
              <Stack direction="row" gap={1}>
                {song._id === activeSongId && play && <MusicSpectrumAnimation />}
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
