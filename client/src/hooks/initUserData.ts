import { useEffect } from 'react'

import { apiAuth } from '@/features/auth/api/auth'

import { apiPlaylist } from '../features/playlists/api/playlist'
import { useUserPlaylists } from '../zustand/playlist'
import { useUser } from '../zustand/user'

export default function useUserData() {
  useEffect(() => {
    setUserData()

    async function setUserData() {
      const data = await apiAuth.getCurrentUser()
      if (data.status !== 200) return
      useUser.setState({
        id: data.data.id,
        roles: data.data.roles,
        username: data.data.username,
        isLoggedIn: true,
      })
      const userPlaylists = await apiPlaylist.lists({ user: data.data.id, limit: 200 })
      userPlaylists.status === 200 && useUserPlaylists.setState({ playlists: userPlaylists.data.list ?? [] })
    }
  }, [])

  return {}
}
