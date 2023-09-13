import AddIcon from '@mui/icons-material/Add'
import { Box, IconButton, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'

import Modal from '@/components/Modal'
import { useUser } from '@/zustand/user'

import CreatePlaylistForm from './CreatePlaylistForm'

export default function CreatePlaylistButton() {
  const [showForm, setShowForm] = useState(false)
  const { isLoggedIn } = useUser()

  function handleClick() {
    if (!isLoggedIn) return toast('You must be logged in to create a playlist')
    setShowForm(true)
  }

  return (
    <Fragment>
      <IconButton title="Create New Playlist" onClick={handleClick} color="inherit">
        <AddIcon />
      </IconButton>

      <Modal style={{ width: '100%', maxWidth: '600px' }} isOpen={showForm} onClose={() => setShowForm(false)}>
        <Box padding={2} width="100%" maxWidth="600px">
          <Typography variant="overline">Create New Playlist</Typography>
          <CreatePlaylistForm />
        </Box>
      </Modal>
    </Fragment>
  )
}
