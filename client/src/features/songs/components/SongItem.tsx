import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import { ISong } from '@/features/songs/types'
import { formatDuration } from '@/helpers'

interface SongItemProps {
  song: ISong
  user?: string
  onClick?: (song: ISong) => void
  secondaryAction?: React.ReactNode
}

export default function SongItem(props: SongItemProps) {
  const { song } = props

  function handleClick() {
    props.onClick?.(song)
  }

  return (
    <ListItem disablePadding alignItems="flex-start" secondaryAction={props.secondaryAction}>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <Avatar src={song.image.cover ?? song.image.thumbnail} alt="name" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              component={Link}
              sx={{ textDecoration: 'none', color: 'inherit', ':hover': { textDecoration: 'underline' } }}
              onClick={e => e.stopPropagation()}
              to={`/songs/${song._id}`}
            >
              {song.name}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography
                component={Link}
                sx={{ textDecoration: 'none', color: 'inherit', ':hover': { textDecoration: 'underline' } }}
                onClick={e => e.stopPropagation()}
                to={`/artists/${btoa(encodeURIComponent(song.artist ?? ''))}`}
                variant="body2"
              >
                {song.artist ?? ''}
                {song.duration ? <> - {formatDuration(song.duration)}</> : ''}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItemButton>
    </ListItem>
  )
}
