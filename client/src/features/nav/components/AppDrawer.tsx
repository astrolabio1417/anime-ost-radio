import { Box, Drawer, Toolbar } from '@mui/material'

import { DRAWER_WIDTH } from '@/constants'

import AppNavTitle from './AppNavTitle'
import NavList from './NavList'

export default function AppDrawer() {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 0,
        },
        display: {
          xs: 'none',
          md: 'block',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar
        sx={{
          borderRight: 'none',
        }}
      >
        <AppNavTitle />
      </Toolbar>
      <Box sx={{ overflow: 'auto', height: '100%', borderRight: '1px solid #E5EAF2', borderTop: '1px solid #E5EAF2' }}>
        <NavList />
      </Box>
    </Drawer>
  )
}
