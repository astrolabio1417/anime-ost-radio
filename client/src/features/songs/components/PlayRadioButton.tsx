import { Pause, PlayArrow } from '@mui/icons-material'
import { Button } from '@mui/material'

import { RADIO_PLAYLIST_ID } from '@/constants'
import { usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'

export default function PlayRadioButton() {
  const { isLive } = useRadio()
  const { play } = usePlayer()

  function handlePlayAiring() {
    if (isLive && play) {
      usePlayer.setState({ play: false })
      return
    }

    useRadio.setState({ isLive: true })
    usePlayer.setState({ activeSongId: '', id: RADIO_PLAYLIST_ID, play: true })
  }

  return (
    <Button title="Play" onClick={handlePlayAiring}>
      {isLive && play ? <Pause /> : <PlayArrow />}
    </Button>
  )
}
