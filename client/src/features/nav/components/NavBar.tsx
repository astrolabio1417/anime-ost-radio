import { Box, Button, Stack, SxProps, Theme, Toolbar } from '@mui/material'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import Microphone from '@/features/player/components/Microphone'
import { useUserPlaylists } from '@/zustand/playlist'
import { useUser } from '@/zustand/user'

import { apiAuth } from '../../auth/api/auth'
import AppMobileDrawer from './AppMobileDrawer'
import AppNavTitle from './AppNavTitle'
import UserAvatar from './UserAvatar'

export default function NavBar(props: { sx?: SxProps<Theme> | undefined }) {
  const { username, isLoggedIn, isAdmin } = useUser()
  const { clearPlaylists } = useUserPlaylists()

  async function handleLogout() {
    await apiAuth.logout()
    useUser.getState().logout()
    clearPlaylists()
    toast('See you next time!', { type: 'success' })
  }

  return (
    <Box
      width="100%"
      sx={{
        gridArea: 'nav',
        bgcolor: 'background.default',
        boxShadow: 'none',
        borderBottom: { md: '1px solid #E5EAF2' },
        ...props.sx,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <Stack direction="row" justifyContent="end" alignItems="center" color="black" width="100%" gap={2}>
          <Stack direction="row" gap={1} marginRight="auto" alignItems="center">
            <AppMobileDrawer />
            <AppNavTitle />
          </Stack>

          {isLoggedIn ? (
            <>
              {isAdmin && <Microphone />}
              <UserAvatar username={username} onLogout={handleLogout} />
            </>
          ) : (
            <Stack gap={1} direction="row">
              <Link to="/login">
                <Button title="Login" variant="contained">
                  Login
                </Button>
              </Link>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </Box>
  )
}