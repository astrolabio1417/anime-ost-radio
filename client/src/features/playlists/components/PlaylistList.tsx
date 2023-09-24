import { List } from '@mui/material'

import { useUserPlaylists } from '@/zustand/playlist'

import PlaylistListHeader from './PlaylistListHeader'
import PlaylistListItem from './PlaylistListItem'

interface PlaylistListProps {
  onLinkClick?: () => void
}

export default function PlaylistList(props: PlaylistListProps) {
  const { playlists } = useUserPlaylists()

  return (
    <List sx={{ paddingTop: 0 }}>
      <PlaylistListHeader />
      {playlists?.map(playlist => (
        <PlaylistListItem key={playlist._id} playlist={playlist} onLinkClick={props.onLinkClick} />
      ))}
    </List>
  )
}
