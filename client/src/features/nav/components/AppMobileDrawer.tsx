import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, IconButton, Toolbar } from '@mui/material'
import React, { useState } from 'react'

import PlaylistList from '@/features/playlists/components/PlaylistList'
import useOutsideClick from '@/hooks/outsideClick'

import NavList from './NavList'
import AppNavTitle from './AppNavTitle'

export default function AppMobileDrawer() {
  const [open, setOpen] = useState(false)
  const containerRef = useOutsideClick(handleClose)

  function handleClose() {
    setOpen(false)
  }

  return (
    <Box sx={{ display: { xs: 'flex', md: 'none !important' } }}>
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
        }}
      >
        {!open ? null : (
          <Box
            ref={containerRef}
            sx={{
              width: '80%',
              height: '100%',
              bgcolor: 'background.default',
              overflowY: 'auto',
            }}
          >
            <Toolbar>
              <AppNavTitle onClick={handleClose} />
            </Toolbar>
            <NavList onLinkClick={handleClose} />
            <PlaylistList onLinkClick={handleClose} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
