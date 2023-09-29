import { Box, Button, Checkbox, FormControlLabel, FormGroup, Modal, Typography } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

import ModalContainer from '@/components/ModalContainer'
import { ISong } from '@/features/songs/types'
import { useUserPlaylists } from '@/zustand/playlist'

import { apiPlaylist } from '../api/playlist'
import { IPlaylist } from '../types'
import CreatePlaylistForm from './CreatePlaylistForm'

interface AddToPlaylistFormProps {
  song: ISong
}

function useAddToPlaylistForm() {
  const [openForm, setFormOpen] = useState(false)
  const {
    playlists,
    addSongToPlaylist: addSongToStatePlaylist,
    removeSongToPlaylist: removeSongToStatePlaylist,
  } = useUserPlaylists()

  async function handleCheckboxChange(playlist: IPlaylist, song: ISong, checked: boolean) {
    if (checked) {
      const toastId = toast.loading(`Adding ${song.name} to playlist...`)
      const res = await apiPlaylist.addSong(playlist._id, song._id)
      const isAdded = res.status === 200

      if (isAdded) addSongToStatePlaylist(playlist._id, song)

      toast.update(toastId, {
        render: res.data.message ?? 'Something went wrong',
        type: isAdded ? 'success' : 'error',
        isLoading: false,
        autoClose: 3000,
      })

      return
    }

    const toastId = toast.loading(`Adding ${song.name} to playlist...`)
    const res = await apiPlaylist.removeSong(playlist._id, song._id)
    const isDeleted = res.status === 200

    toast.update(toastId, {
      render: res.data.message ?? 'Something went wrong',
      type: isDeleted ? 'success' : 'error',
      isLoading: false,
      autoClose: 3000,
    })
    isDeleted && removeSongToStatePlaylist(playlist._id, song)
    return
  }

  return { playlists, handleCheckboxChange, setFormOpen, openForm }
}

export default function AddToPlaylistForm(props: AddToPlaylistFormProps) {
  const { song } = props
  const { playlists, handleCheckboxChange, setFormOpen, openForm } = useAddToPlaylistForm()

  return (
    <Box width="100%" height="100%">
      <FormGroup>
        <Typography variant="subtitle2">Save song to...</Typography>

        {playlists.map(playlist => (
          <FormControlLabel
            key={playlist._id}
            control={
              <Checkbox
                onChange={(_, checked) => handleCheckboxChange(playlist, song, checked)}
                checked={!!playlist.songs.filter(s => s._id === song._id).length}
              />
            }
            label={playlist.title}
          />
        ))}

        <Button
          sx={{ marginTop: 1 }}
          title="Create New Playlist"
          variant="contained"
          color="primary"
          onClick={() => setFormOpen(true)}
        >
          Create New Playlist
        </Button>
      </FormGroup>

      <Modal open={openForm} onClose={() => setFormOpen(false)}>
        <ModalContainer>
          <Typography variant="subtitle2">Create Playlist</Typography>
          <CreatePlaylistForm />
        </ModalContainer>
      </Modal>
    </Box>
  )
}
