import { Box, Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'

import Modal from '@/components/Modal'
import { ISong } from '@/features/songs/types'
import { useUserPlaylists } from '@/zustand/playlist'

import { addSongToPlaylist, deleteSongToPlaylist } from '../api/playlist'
import { IPlaylist } from '../types'
import CreatePlaylistForm from './CreatePlaylistForm'

interface AddToPlaylistFormProps {
  song: ISong
}

function useAddToPlaylistForm() {
  const [cookies] = useCookies(['session'])
  const [openForm, setFormOpen] = useState(false)
  const {
    playlists,
    addSongToPlaylist: addSongToStatePlaylist,
    removeSongToPlaylist: removeSongToStatePlaylist,
  } = useUserPlaylists()

  async function handleCheckboxChange(playlist: IPlaylist, song: ISong, checked: boolean) {
    if (checked) {
      const res = await addSongToPlaylist(playlist._id, song._id, cookies.session)
      if (res?.ok) {
        toast('Song added to playlist')
        addSongToStatePlaylist(playlist._id, song)
        return
      }
      toast(res?.data?.message ? res.data.message : 'Something went wrong', { type: 'error' })
      return
    }

    const res = await deleteSongToPlaylist(playlist._id, song._id, cookies.session)
    if (res?.ok) {
      toast('Song removed from playlist')
      removeSongToStatePlaylist(playlist._id, song)
      return
    }
    toast(res?.data.message ? res.data.message : 'Something went wrong', { type: 'error' })
  }

  return { playlists, handleCheckboxChange, setFormOpen, openForm }
}

export default function AddToPlaylistForm(props: AddToPlaylistFormProps) {
  const { song } = props
  const { playlists, handleCheckboxChange, setFormOpen, openForm } = useAddToPlaylistForm()

  return (
    <Box width="100%" height="100%">
      <FormGroup sx={{ padding: 2 }}>
        <Typography variant="overline">Save song to...</Typography>

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

        <Button title="Create New Playlist" variant="contained" color="primary" onClick={() => setFormOpen(true)}>
          Create New Playlist
        </Button>
      </FormGroup>

      <Modal style={{ width: '100%', maxWidth: '600px' }} isOpen={openForm} onClose={() => setFormOpen(false)}>
        <Box padding={2}>
          <Typography variant="overline">Create Playlist</Typography>
          <CreatePlaylistForm />
        </Box>
      </Modal>
    </Box>
  )
}
