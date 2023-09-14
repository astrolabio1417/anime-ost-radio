import { AppBar, Button, Stack, Toolbar } from '@mui/material'
import { useCookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { DRAWER_WIDTH } from '@/constants'
import { useUserPlaylists } from '@/zustand/playlist'
import { useUser } from '@/zustand/user'

import { logout } from '../../auth/api/auth'
import AppMobileDrawer from './AppMobileDrawer'
import AppNavTitle from './AppNavTitle'
import UserAvatar from './UserAvatar'

export default function AppHeader() {
  const { logout: userLogout, username, isLoggedIn } = useUser()
  const { clearPlaylists } = useUserPlaylists()
  const [cookies, , removeCookies] = useCookies(['session'])
  const session = cookies.session

  async function handleLogout() {
    await logout(session)
    userLogout()
    removeCookies('session')
    clearPlaylists()
    toast('See you next time!', { type: 'success' })
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: {
          xs: '100%',
          md: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
        ml: `${DRAWER_WIDTH}px`,
        bgcolor: 'background.default',
        boxShadow: 'none',
        borderBottom: {
          md: '1px solid #E5EAF2',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
        <Stack direction="row" justifyContent="end" alignItems="center" color="black" width="100%">
          <Stack
            direction="row"
            gap={1}
            marginRight="auto"
            alignItems="center"
            sx={{
              display: {
                xs: 'flex',
                md: 'none !important',
              },
            }}
          >
            <AppMobileDrawer />
            <AppNavTitle />
          </Stack>
          {isLoggedIn ? (
            <UserAvatar username={username} onLogout={handleLogout} />
          ) : (
            <Stack gap={1} direction="row">
              <Link to="/register">
                <Button title="Sign Up" variant="contained">
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button title="Login" variant="contained">
                  Login
                </Button>
              </Link>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}