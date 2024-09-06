import { ISong } from '@/features/songs/types'
import { getSongCover, getsongThumbnail } from '@/helpers'
import { usePlayer } from '@/zustand/player'

interface Props {
  songs: ISong[]
  playlistId: string
  pageUrl: string
  title: string
}

export default function usePlayerHandler(props: Props) {
  const { songs, playlistId, pageUrl, title } = props
  const { id: playerId, pause, playSongs, isPlaying, currentSongId } = usePlayer()
  const isCurrentPlaylist = playerId === playlistId
  const isPlaylistPlaying = isCurrentPlaylist && isPlaying
  const currentSong = isCurrentPlaylist ? songs?.find(a => a._id === currentSongId) : undefined

  function togglePlay(song?: ISong) {
    const isCurrentSongOrNone = !song?._id || currentSong?._id === song?._id

    if (isPlaylistPlaying && isCurrentSongOrNone) return pause()
    if (!songs.length) return

    playSongs({
      title,
      pageUrl,
      currentSongId: (isCurrentSongOrNone ? currentSong?._id : song?._id) || songs[0]._id,
      playerId: playlistId,
      songs: songs.map(song => ({
        id: song._id,
        image: getsongThumbnail(song) || getSongCover(song) || '',
        src: song.musicUrl,
        title: song.name,
        subtitle: song.artist,
      })),
    })
  }

  return { togglePlay, isPlaylistPlaying, isCurrentPlaylist, currentSong }
}
