import { List, Stack, Typography } from '@mui/material'

import PageHelmet from '@/components/PageHelmet'
import Banner from '@/features/player/components/Banner'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import { formatDuration, getSongCover, getsongThumbnail } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'
import { useUser } from '@/zustand/user'

import RadioPlayButton from '../../player/components/RadioPlayButton'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import SongItem from '../components/SongItem'
import VoteAction from '../components/VoteAction'

export default function QueueSongs() {
  const { current, queue } = useRadio()
  const { id: userId } = useUser()
  const { name, artist, duration, show, vote } = current ?? {}
  const { playSong } = usePlayer()
  const coverImage = getSongCover(current)
  const thumbnailImage = getsongThumbnail(current)

  return (
    <>
      <PageHelmet title="AnimeBeats" />

      <Stack width="100%" gap={2}>
        <Banner
          title={name ?? ''}
          image={thumbnailImage ?? coverImage}
          bgImage={coverImage ?? thumbnailImage}
          subtitle={artist}
        >
          {duration && (
            <Typography variant="caption" marginTop={2}>
              Duration: {formatDuration(duration)}
            </Typography>
          )}
          {show && <Typography variant="caption">Anime: {show}</Typography>}
          {vote && <Typography variant="caption">Vote: {vote.total}</Typography>}
        </Banner>

        <ControlsContainer>
          <RadioPlayButton />
          <AddToPlaylistAction song={current} />
        </ControlsContainer>

        <List>
          <Typography paddingX={2} variant="h6">
            Next On Air
          </Typography>

          {queue.map(song => (
            <SongItem
              key={song._id}
              song={song}
              user={userId}
              onClick={() => playSong(song)}
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
    </>
  )
}
