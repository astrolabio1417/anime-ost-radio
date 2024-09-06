import { RADIO_PLAYLIST_ID } from '@/constants'
import { usePlayer } from '@/zustand/player'
import { useRadio } from '@/zustand/radio'

import PlayButton from './PlayButton'

export default function RadioPlayButton() {
  const { isLive } = useRadio()
  const { isPlaying } = usePlayer()

  function handlePlayAiring() {
    if (isLive && isPlaying) {
      usePlayer.setState({ isPlaying: false })
      return
    }

    const radioState = useRadio.getState()
    const songs = [radioState.parsedSong(), ...radioState.parsedSongs()]

    usePlayer.getState().playSongs({
      title: 'Live Radio',
      pageUrl: '/',
      isLive: true,
      currentSongId: useRadio.getState().current._id || songs?.[0].id || '',
      playerId: RADIO_PLAYLIST_ID,
      songs,
    })
  }

  return <PlayButton isPlaying={isLive && isPlaying} onClick={handlePlayAiring} />
}
