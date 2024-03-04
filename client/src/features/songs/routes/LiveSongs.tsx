import { List, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import PageHelmet from '@/components/PageHelmet'
import ControlsContainer from '@/features/player/components/ControlsContainer'
import { getArtistUrlByName, getSongCover, getsongThumbnail, getSongUrlById } from '@/helpers'
import { usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'
import { useUser } from '@/zustand/user'

import RadioPlayButton from '../../player/components/RadioPlayButton'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import SongBanner from '../components/SongBanner'
import SongItem from '../components/SongItem'
import VoteAction from '../components/VoteAction'

export default function LiveSongs() {
  const { current, queue } = useRadio()
  const { id: userId } = useUser()
  const { name, artist, _id } = current ?? {}
  const { playSong } = usePlayer()
  const coverImage = getSongCover(current)
  const thumbnailImage = getsongThumbnail(current)

  return (
    <>
      <PageHelmet title="AnimeBeats" />

      <Stack width="100%" gap={2}>
        <SongBanner
          category="Song"
          title={<Link to={getSongUrlById(_id)}>{name}</Link>}
          subtitle={!artist ? null : <Link to={getArtistUrlByName(artist)}>{artist}</Link>}
          bgImage={coverImage ?? thumbnailImage}
          image={thumbnailImage ?? coverImage}
        />

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
