import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import { AxiosError } from 'axios'
import React from 'react'
import { toast } from 'react-toastify'

import { ISong } from '@/features/songs/types'
import { usePlayer } from '@/zustand/player'
import { useUserPlaylists } from '@/zustand/playlist'
import { useUser } from '@/zustand/user'

import { apiPlaylist } from '../api/playlist'
import { IPlaylistSongUpdateResponse } from '../types'

interface RemoveSongActionProps {
  playlistId: string
  song: ISong
  onDelete?: (song: ISong) => void
}

export default function RemoveSongAction({ song, onDelete, playlistId }: RemoveSongActionProps) {
  const { removeSong, id } = usePlayer()
  const { isLoggedIn } = useUser()
  const { removeSongToPlaylist } = useUserPlaylists()

  async function handleDelete() {
    if (!isLoggedIn) return toast('You must be logged in to delete a song', { type: 'error' })
    const toastId = toast.loading(`Deleting ${song.name}...`)

    try {
      const res = await apiPlaylist.removeSong(playlistId, song._id)

      toast.update(toastId, {
        render: res.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      })

      onDelete?.(song)
      playlistId === id && removeSong(song)
      removeSongToPlaylist(playlistId, song)
    } catch (err) {
      const error = err as AxiosError<IPlaylistSongUpdateResponse>

      toast.update(toastId, {
        render: error.response?.data.message ?? error.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })

      console.error(error)
    }
  }

  return (
    <React.Fragment>
      <IconButton title="Remove" color="inherit" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </React.Fragment>
  )
}
