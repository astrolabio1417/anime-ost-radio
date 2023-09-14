import { List, Stack, Typography } from '@mui/material'

import Banner from '@/features/player/components/Banner'
import { formatDuration, getSongCover, getsongThumbnail } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'
import { useUser } from '@/zustand/user'

import AddToPlaylistAction from '../components/AddToPlaylistAction'
import MusicSpectrumAnimation from '../components/MusicSpectrumAnimation'
import PlayRadioButton from '../components/PlayRadioButton'
import SongItem from '../components/SongItem'
import VoteAction from '../components/VoteAction'

export default function QueueSongs() {
  const { current, queue } = useRadio()
  const { id: userId } = useUser()
  const { name, artist, duration, show, vote } = current ?? {}
  const { activeSongId, playSong, play } = usePlayer()
  const coverImage = getSongCover(current)

  return (
    <Stack width="100%" gap={2}>
      <Banner
        title={name ?? ''}
        image={coverImage}
        bgImage={coverImage ?? getsongThumbnail(current) ?? ''}
        subtitle={artist}
      >
        {duration && (
          <Typography variant="caption" marginTop={2}>
            Duration: {formatDuration(duration)}
          </Typography>
        )}
        {show?.name && <Typography variant="caption">Anime: {show.name}</Typography>}
        {vote && <Typography variant="caption">Vote: {vote.total}</Typography>}
      </Banner>

      <PlayRadioButton />

      <Typography paddingX={2} variant="overline">
        Next On Air
      </Typography>

      <List>
        {queue.map(song => (
          <SongItem
            key={song._id}
            song={song}
            user={userId}
            onClick={() => playSong(song)}
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
    </Stack>
  )
}
