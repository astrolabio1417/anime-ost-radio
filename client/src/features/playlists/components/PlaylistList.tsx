import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { Link } from 'react-router-dom'

import { useUserPlaylists } from '@/zustand/playlist'

import CreatePlaylistButton from './CreatePlaylistButton'

interface PlaylistListProps {
  onLinkClick?: () => void
}

export default function PlaylistList(props: PlaylistListProps) {
  const { playlists } = useUserPlaylists()

  return (
    <Box height="100%" width="100%">
      <Box display="flex" alignItems="center" gap={1} paddingX={2} paddingTop={1}>
        <LibraryMusicIcon />
        <Typography variant="body1">Playlists</Typography>
        <Box marginLeft="auto">
          <CreatePlaylistButton />
        </Box>
      </Box>

      {playlists && (
        <List>
          {playlists.map(playlist => (
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
          ))}
        </List>
      )}
    </Box>
  )
}
