import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { blue } from '@mui/material/colors'
import { Link } from 'react-router-dom'

import { useUserPlaylists } from '@/zustand/playlist'

import CreatePlaylist from './CreatePlaylist'

interface PlaylistListProps {
  onLinkClick?: () => void
}

export default function PlaylistList(props: PlaylistListProps) {
  const { playlists } = useUserPlaylists()

  return (
    <List>
      <ListItem>
        <CreatePlaylist />
      </ListItem>

      {playlists.length ? (
        playlists.map(playlist => (
          <Link
            onClick={props.onLinkClick}
            key={playlist._id}
            to={`/playlists/${playlist._id}`}
            style={{ textDecoration: 'inherit', color: 'inherit' }}
          >
            <ListItemButton>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar variant="square" src={playlist.image?.thumbnail} sx={{ bgcolor: blue[700] }}>
                    {playlist?.title?.substring(0, 2)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={playlist.title} />
              </ListItem>
            </ListItemButton>
          </Link>
        ))
      ) : (
        <></>
      )}
    </List>
  )
}
