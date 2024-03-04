import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Avatar, Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { blue } from '@mui/material/colors'
import React from 'react'
import { Link } from 'react-router-dom'

import { ISong } from '@/features/songs/types'
import { usePlayer } from '@/zustand/player'

interface SongItemProps {
  song: ISong
  user?: string
  onClick?: (song: ISong) => void
  secondaryAction?: React.ReactNode
}

export default function SongItem(props: SongItemProps) {
  const { song } = props
  const { play, activeSongId } = usePlayer()

  return (
    <ListItem disablePadding alignItems="flex-start" secondaryAction={props.secondaryAction}>
      <ListItemButton component={Link} to={`/songs/${song._id}`}>
        <ListItemIcon
          sx={{
            position: 'relative',
            ':hover': {
              transform: 'scale(1.1)',
              '& #avatar-icon': {
                opacity: 0,
              },
            },
            transition: 'transform 0.2s ease-in-out',
          }}
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            song._id === activeSongId && play ? usePlayer.setState({ play: false }) : props.onClick?.(song)
          }}
        >
          <Avatar
            sx={{
              bgcolor: blue[600],
              width: 75,
              height: 75,
              minWidth: 75,
              minHeight: 75,
            }}
            variant="square"
            src={song.image.cover ?? song.image.thumbnail}
            alt="name"
          />
          <Box
            width="100%"
            height="100%"
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex={0}
            id="avatar-icon"
            sx={{ inset: 0, pointerEvents: 'none', opacity: 1, transition: 'opacity 0.2s ease-in-out' }}
          >
            {song._id === activeSongId && play ? (
              <PauseIcon sx={{ width: 50, height: 50, color: '#fff' }} />
            ) : (
              <PlayArrowIcon sx={{ width: 50, height: 50, color: '#fff' }} />
            )}
          </Box>
        </ListItemIcon>

        <ListItemText
          sx={{
            paddingLeft: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: '3',
          }}
          primary={song.name}
          secondary={song.artist ?? ''}
        />
      </ListItemButton>
    </ListItem>
  )
}
