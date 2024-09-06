import AddIcon from '@mui/icons-material/Add'
import { ListItem, ListItemText, Modal, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'

import AppButton from '@/components/AppButton'
import ModalContainer from '@/components/ModalContainer'
import { useUser } from '@/zustand/user'

import CreatePlaylistForm from './CreatePlaylistForm'

export default function PlaylistListHeader() {
  const [showForm, setShowForm] = useState(false)
  const { isLoggedIn } = useUser()

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isLoggedIn) return toast('You must be logged in to create a playlist')

    e.preventDefault()
    e.stopPropagation()
    setShowForm(prev => !prev)
  }

  function handleClose() {
    setShowForm(false)
  }

  return (
    <Fragment>
      <ListItem>
        <ListItemText>
          <AppButton style={{ width: '100%' }} onClick={handleClick}>
            <AddIcon />
            <span>New Playlist</span>
          </AppButton>
        </ListItemText>
      </ListItem>

      <Modal open={showForm} onClose={handleClose}>
        <ModalContainer onClose={handleClose}>
          <Typography variant="subtitle2">Create New Playlist</Typography>
          <CreatePlaylistForm />
        </ModalContainer>
      </Modal>
    </Fragment>
  )
}
