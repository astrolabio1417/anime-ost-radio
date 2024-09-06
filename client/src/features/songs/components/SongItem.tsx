import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Avatar, Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { blue } from '@mui/material/colors'
import React from 'react'
import { Link } from 'react-router-dom'

import { ISong } from '@/features/songs/types'

interface SongItemProps {
  song: ISong
  userId?: string
  onClick?: (song: ISong) => void
  secondaryAction?: React.ReactNode
  isPlaying?: boolean
}

export default function SongItem(props: SongItemProps) {
  const { song, onClick, isPlaying } = props

  function onClickAvatar(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    onClick?.(song)
  }

  return (
    <ListItem
      sx={{ ':hover': { '& #avatar-icon': { opacity: 1 } } }}
      disablePadding
      alignItems="flex-start"
      secondaryAction={props.secondaryAction}
    >
      <ListItemButton component={Link} to={`/songs/${song._id}`}>
        <ListItemIcon
          sx={{
            position: 'relative',
            ':hover': { transform: 'scale(1.1)' },
            transition: 'transform 0.2s ease-in-out',
          }}
          onClick={onClickAvatar}
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
            src={song.image.thumbnail || song.image.cover}
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
            sx={{ inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s ease-in-out' }}
          >
            {isPlaying ? (
              <PauseIcon sx={{ width: 50, height: 50, color: '#fff' }} />
            ) : (
              <PlayArrowIcon sx={{ width: 50, height: 50, color: '#fff' }} />
            )}
          </Box>
        </ListItemIcon>

        <ListItemText
          sx={{
            paddingLeft: 1,
            paddingRight: 6,
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
