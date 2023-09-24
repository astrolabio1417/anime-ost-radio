import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

import { useUserPlaylists } from '@/zustand/playlist'

import { apiPlaylist } from '../api/playlist'
import { IPlaylistDataForm } from '../types'
import PlaylistForm from './PlaylistForm'

export default function CreatePlaylistForm() {
  async function handleSubmit(data: IPlaylistDataForm) {
    const toastId = toast.loading('Creating playlist...')

    try {
      const newPlaylist = await apiPlaylist.create(data)
      toast.update(toastId, {
        render: newPlaylist?.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      })
      newPlaylist.data.playlist && useUserPlaylists.getState().addPlaylist(newPlaylist.data.playlist)
    } catch (e) {
      const error = e as AxiosError<{ message: string }>
      toast.update(toastId, {
        render: error.response?.data.message ?? error.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  }

  return <PlaylistForm onSubmit={handleSubmit} clearOnSuccess={true} />
}
