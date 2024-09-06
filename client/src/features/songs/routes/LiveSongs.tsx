import { Box, List, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
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
import { ISong } from '../types'

export default function LiveSongs() {
  const { current, queue } = useRadio()
  const userId = useUser(state => state.id)
  const { name, artist, _id } = current ?? {}
  const coverImage = getSongCover(current)
  const thumbnailImage = getsongThumbnail(current)
  const { currentSongId, pause, isPlaying } = usePlayer()

  function handlePlay(song: ISong) {
    if (currentSongId === song._id && isPlaying) return pause()

    usePlayer.getState().playSongs({
      songs: [
        {
          id: song._id,
          image: getSongCover(song) || getsongThumbnail(song) || '',
          src: song.musicUrl,
          title: song.name,
          subtitle: song.artist,
        },
      ],
      currentSongId: song._id,
      playerId: song._id,
    })
  }

  return (
    <>
      <PageHelmet title="AnimeMusic" />

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

          <AnimatePresence mode="popLayout">
            {queue.map(song => (
              <motion.div
                layout
                initial={{ x: '25%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '25%', opacity: 0 }}
                transition={{ type: 'tween' }}
                style={{ overflowAnchor: 'none' }}
                key={song._id}
              >
                <SongItem
                  song={song}
                  userId={userId}
                  isPlaying={currentSongId === song._id}
                  onClick={handlePlay}
                  secondaryAction={
                    <Stack direction="row">
                      <Box>
                        <AddToPlaylistAction song={song} />
                      </Box>
                      <VoteAction song={song} />
                    </Stack>
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Stack>
    </>
  )
}
