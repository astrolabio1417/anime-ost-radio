import AddIcon from '@mui/icons-material/Add'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import { IconButton, ListItem, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'

import ModalContainer from '@/components/ModalContainer'
import { useUser } from '@/zustand/user'

import CreatePlaylistForm from './CreatePlaylistForm'

export default function PlaylistListHeader() {
  const [showForm, setShowForm] = useState(false)
  const { isLoggedIn } = useUser()

  function handleClick() {
    if (!isLoggedIn) return toast('You must be logged in to create a playlist')
    setShowForm(true)
  }

  return (
    <Fragment>
      <ListItem
        secondaryAction={
          <IconButton onClick={handleClick}>
            <AddIcon />
          </IconButton>
        }
      >
        <ListItemIcon>
          <LibraryMusicIcon />
        </ListItemIcon>
        <ListItemText>Library</ListItemText>
      </ListItem>
      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <ModalContainer>
          <Typography variant="subtitle2">Create New Playlist</Typography>
          <CreatePlaylistForm />
        </ModalContainer>
      </Modal>
    </Fragment>
  )
}
