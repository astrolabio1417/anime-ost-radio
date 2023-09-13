import { MusicNote } from '@mui/icons-material'
import CircleIcon from '@mui/icons-material/Circle'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Fab, IconButton, Stack, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import { create } from 'zustand'

import { RADIO_STREAM } from '../constants'
import { useRadio } from '../zustand/radio'
import AudioPlayer from './AudioPlayer'

interface PlayerState {
  play: boolean
  isPlaying: boolean
  title: string
  subtitle?: string
  src: string
  img?: string
  downloadLink?: string
  isRadioPlaying: boolean
}

interface PlayerFunc {
  playAiring: () => void
}

const defaultState: PlayerState = {
  play: false,
  isRadioPlaying: true,
  isPlaying: false,
  src: RADIO_STREAM,
  title: '',
  img: '',
  downloadLink: '',
  subtitle: undefined,
}

const usePlayer = create<PlayerState & PlayerFunc>()(set => ({
  ...defaultState,
  playAiring: () => set({ isRadioPlaying: true, src: RADIO_STREAM, play: true }),
}))

export default function PlayerFloatContainer() {
  const [minimize, setMinimize] = useState(false)
  const { title, subtitle, img, src, isRadioPlaying, play, playAiring } = usePlayer()
  const { current } = useRadio()
  const { musicUrl, name, artist, image } = current ?? {}
  const downloadableSrc = isRadioPlaying ? musicUrl ?? '' : src ?? ''
  const audioSrc = src ?? ''
  const audioTitle = isRadioPlaying ? name ?? '' : title ?? ''
  const audioSubtitle = isRadioPlaying ? artist ?? '' : subtitle ?? ''
  const audioImg = isRadioPlaying ? image?.cover ?? image?.thumbnail ?? '' : img ?? ''

  return (
    <Fragment>
      <Fab
        size="medium"
        color="primary"
        aria-label="add"
        onClick={() => setMinimize(false)}
        sx={{
          position: 'fixed',
          bottom: 1,
          right: 1,
          visibility: minimize ? 'visible' : 'hidden',
        }}
      >
        <MusicNote />
      </Fab>

      <Box
        position="fixed"
        width="100%"
        maxWidth="500px"
        bgcolor="background.paper"
        boxShadow="2px 2px 2px rgba(0,0,0,0.53)"
        sx={{
          borderRadius: '5px 5px 0px 0px',
          transform: minimize ? 'translateY(100%)' : 'translateY(0%)',
          transition: 'transform 0.4s ease-in-out',
        }}
        bottom={0}
        right={0}
        zIndex={1}
        overflow="hidden"
      >
        <Box padding={2} width="100%" position="relative" bgcolor="#0C090A">
          <Box
            position="absolute"
            style={{
              backgroundImage: `url(${audioImg})`,
              inset: 0,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              filter: 'blur(3px) brightness(80%)',
            }}
            width="100%"
            height="100%"
            zIndex={0}
          />

          <Box sx={{ marginLeft: 'auto', display: 'inline-block' }} position="absolute" right={5} top={5} zIndex={2}>
            <IconButton
              title="Close"
              color="primary"
              sx={{ height: 10, width: 'auto' }}
              onClick={() => setMinimize(true)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack
            direction="row"
            gap={2}
            position="relative"
            zIndex={1}
            paddingTop={1}
            color="white"
            style={{ textShadow: '0px 4px 4px #282828' }}
          >
            <Box width={100} height={100} overflow="hidden" borderRadius={1} bgcolor="#0C090A">
              <img src={audioImg} width="100%" height="100%" />
            </Box>
            <Box>
              <Typography variant="h5">{audioTitle}</Typography>
              <Typography variant="caption">{audioSubtitle}</Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="space-between" paddingX={2} gap={2}>
          <Button
            title="Live"
            color={isRadioPlaying ? 'error' : 'inherit'}
            onClick={() => {
              if (isRadioPlaying) {
                usePlayer.setState({ src: '' })
                setTimeout(playAiring, 500)
                return
              }
              playAiring()
            }}
            startIcon={<CircleIcon />}
          >
            <Typography variant="overline">Live</Typography>
          </Button>
          <AudioPlayer
            play={play}
            downloadLink={downloadableSrc}
            onPause={() => usePlayer.setState({ isPlaying: false })}
            onPlayChange={isPlaying => usePlayer.setState({ isPlaying })}
            src={audioSrc}
          />
        </Stack>
      </Box>
    </Fragment>
  )
}
