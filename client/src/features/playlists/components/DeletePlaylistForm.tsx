import { Button, ButtonGroup, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

import { useUserPlaylists } from '@/zustand/playlist'

import { apiPlaylist } from '../api/playlist'

interface DeletePlaylistFormProps {
  playlistId: string
  onClose: () => void
}

export default function DeletePlaylistForm(props: DeletePlaylistFormProps) {
  async function handleDelete() {
    const toastId = toast.loading('Deleting playlist...')

    try {
      const res = await apiPlaylist.delete(props.playlistId)
      toast.update(toastId, {
        render: res.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      })
      useUserPlaylists.getState().removePlaylist(props.playlistId)
      props.onClose()
    } catch (e) {
      const error = e as AxiosError<Error>
      toast.update(toastId, {
        render: error.response?.data.message ?? error.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  }

  return (
    <form>
      <Typography variant="body1" fontWeight={700} mb={2}>
        Are you sure you want to delete this playlist?
      </Typography>
      <Typography variant="body2" mb={2}>
        This will delete the playlist and all of its songs, You cannot undo this action.
      </Typography>
      <ButtonGroup>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
        <Button onClick={props.onClose} variant="contained" color="primary">
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  )
}
