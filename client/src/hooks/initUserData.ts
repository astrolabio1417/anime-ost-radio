import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'

import { getUser } from '../features/auth/api/auth'
import { getPlaylists } from '../features/playlists/api/playlist'
import { useUserPlaylists } from '../zustand/playlist'
import { useUser } from '../zustand/user'

let isUserDataInit = false

export default function useUserData() {
  const [cookies, , clearCookies] = useCookies(['session'])

  if (!isUserDataInit && cookies.session) {
    isUserDataInit = true
    toast.promise(setUserData, {
      pending: 'Fetching user data...',
      error: 'Failed to fetch user data',
      success: 'Fetched user data',
    })
  }

  isUserDataInit = true

  async function setUserData() {
    const data = await getUser(cookies.session)
    if (!data) return clearCookies('session')
    useUser.setState({
      id: data.id,
      roles: data.roles,
      username: data.username,
      isLoggedIn: true,
    })
    const userPlaylists = await getPlaylists({ user: data.id })
    useUserPlaylists.setState({ playlists: userPlaylists ?? [] })
  }

  return {}
}
