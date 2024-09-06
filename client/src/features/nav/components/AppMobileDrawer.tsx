import MenuIcon from '@mui/icons-material/Menu'
import { Box, Divider, IconButton, Toolbar } from '@mui/material'
import { useState } from 'react'

import PlaylistList from '@/features/playlists/components/PlaylistList'

import AppNavTitle from './AppNavTitle'
import NavList from './NavList'

export default function AppMobileDrawer() {
  const [open, setOpen] = useState(false)

  function handleClose() {
    setOpen(false)
  }

  return (
    <Box
      sx={{ display: { xs: 'flex', md: 'none !important' } }}
      onClick={e => {
        const target = e.target as HTMLDivElement
        if (target.id === 'drawer-outside') handleClose()
      }}
    >
      <IconButton title="Menu" onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Box
        id="drawer-outside"
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
        <Box
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
          <Divider variant="middle" />
          <PlaylistList onLinkClick={handleClose} />
        </Box>
      </Box>
    </Box>
  )
}
