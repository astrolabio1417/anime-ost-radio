import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { PlayerSongI } from '@/zustand/player'

interface PlayerSongListProps {
  songPlayingIndex: number
  songs: PlayerSongI[]
  onSongChange?: (song: PlayerSongI) => void
  title?: string
  pageUrl?: string
  disable: boolean
}

export default function PlayerSongList(props: PlayerSongListProps) {
  const { songs, disable, onSongChange, songPlayingIndex, title, pageUrl } = props

  return (
    <Box sx={{ color: 'black' }}>
      {title && (
        <Typography variant="h6" fontWeight={700}>
          {pageUrl ? <Link to={pageUrl}>{title}</Link> : title}
        </Typography>
      )}
      <List>
        {songs.map((song, i) => (
          <ListItem
            key={song.id}
            disablePadding
            alignItems="flex-start"
            sx={{ backgroundColor: i === songPlayingIndex ? 'rgba(0, 0, 0, 0.04)' : 'inherit' }}
          >
            <ListItemButton
              sx={{ cursor: disable ? 'unset' : 'inherit' }}
              onClick={() => !disable && onSongChange?.(song)}
            >
              <ListItemText primary={song.title} secondary={song.subtitle} />
              {i === songPlayingIndex && <Typography variant="button">Playing</Typography>}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
