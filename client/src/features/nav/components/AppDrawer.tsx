import { Box, SxProps, Theme } from '@mui/material'

import { DRAWER_WIDTH } from '@/constants'
import PlaylistList from '@/features/playlists/components/PlaylistList'

import NavList from './NavList'

export default function AppDrawer(props: { sx?: SxProps<Theme> | undefined }) {
  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        // display: { xs: 'none', md: 'block' },
        gridArea: 'sidebar',
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid #E5EAF2',
        // resize: 'horizontal',
        overflow: 'auto',
        ...props.sx,
      }}
    >
      <NavList />
      <PlaylistList />
    </Box>
  )
}
