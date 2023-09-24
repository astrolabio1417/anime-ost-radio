import { AxiosError } from 'axios'
import { useEffect } from 'react'

import { apiAuth } from '@/features/auth/api/auth'

import { useUserPlaylists } from '../zustand/playlist'
import { useUser } from '../zustand/user'

export default function useUserData() {
  useEffect(() => {
    setUserData()

    async function setUserData() {
      try {
        const data = await apiAuth.getCurrentUser()
        const { id, roles, username } = data.data
        useUser.setState({ id, roles, username, isLoggedIn: true })
        useUserPlaylists.getState().init(id)
      } catch (e) {
        const error = e as AxiosError<{ message: string }>
        console.error(error)
      }
    }
  }, [])

  return {}
}
