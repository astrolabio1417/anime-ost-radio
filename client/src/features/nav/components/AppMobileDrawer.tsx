import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, IconButton, Toolbar } from '@mui/material'
import React, { useState } from 'react'

import PlaylistList from '@/features/playlists/components/PlaylistList'

import NavList from './NavList'

export default function AppMobileDrawer() {
  const [open, setOpen] = useState(false)

  function handleClose() {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <IconButton title="Menu" onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          transform: open ? 'translateX(0%)' : 'translateX(-100%)',
          transition: 'transform 0.2s ease-in-out',
          position: 'fixed',
          inset: 0,
          zIndex: 11,
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar>
          <IconButton title="Close" sx={{ marginLeft: 'auto' }} onClick={handleClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <NavList onLinkClick={handleClose} />
        <PlaylistList onLinkClick={handleClose} />
      </Box>
    </React.Fragment>
  )
}
