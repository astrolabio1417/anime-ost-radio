import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import React from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'

import { ISong } from '@/features/songs/types'
import { usePlayer } from '@/zustand/player'
import { useUserPlaylists } from '@/zustand/playlist'

import { deleteSongToPlaylist } from '../api/playlist'

interface RemoveSongActionProps {
  playlistId: string
  song: ISong
  onDelete?: (song: ISong) => void
}

export default function RemoveSongAction({ song, onDelete, playlistId }: RemoveSongActionProps) {
  const [cookies] = useCookies(['session'])
  const { removeSong } = usePlayer()
  const { removeSongToPlaylist } = useUserPlaylists()

  async function handleDelete() {
    if (!cookies.session) toast('You must be logged in to delete a song', { type: 'error' })
    const toastId = toast.loading(`Deleting ${song.name}...`)
    const res = await deleteSongToPlaylist(playlistId, song._id, cookies.session)

    if (!res?.ok) {
      return toast.update(toastId, {
        render: res?.data?.message ?? 'Something went wrong',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      })
    }

    onDelete?.(song)
    removeFromStates(playlistId, song)
    toast.update(toastId, { render: 'Song deleted', type: 'success', isLoading: false, autoClose: 2000 })
  }

  function removeFromStates(playlistId: string, song: ISong) {
    removeSong(song)
    removeSongToPlaylist(playlistId, song)
  }

  return (
    <React.Fragment>
      <IconButton title="Remove" color="inherit" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </React.Fragment>
  )
}
