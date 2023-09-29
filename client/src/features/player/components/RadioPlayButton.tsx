import { RADIO_PLAYLIST_ID } from '@/constants'
import { usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'

import BannerPlayButton from './BannerPlayButton'

export default function RadioPlayButton() {
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

  return <BannerPlayButton isPlaying={isLive && play} onClick={handlePlayAiring} />
}
