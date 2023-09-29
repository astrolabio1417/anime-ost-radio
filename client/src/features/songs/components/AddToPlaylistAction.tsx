import FavoriteIcon from '@mui/icons-material/Favorite'
import { IconButton, Modal } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import ModalContainer from '@/components/ModalContainer'
import { ISong } from '@/features/songs/types'
import { useUser } from '@/zustand/user'

import AddToPlaylistForm from '../../playlists/components/AddToPlaylistForm'

interface AddToPlaylistActionProps {
  song: ISong
}

export default function AddToPlaylistAction({ song }: AddToPlaylistActionProps) {
  const [showModal, setShowModal] = useState(false)
  const { isLoggedIn } = useUser()

  function handleClick() {
    if (!isLoggedIn) return toast('You must be logged in to create a playlist', { type: 'error' })
    setShowModal(true)
  }

  return (
    <React.Fragment>
      <IconButton title="Add to playlist" onClick={handleClick} edge="end" aria-label="playlist" color="inherit">
        <FavoriteIcon />
      </IconButton>

      {showModal && (
        <Modal style={{ width: '100%', maxWidth: '600px' }} open={showModal} onClose={() => setShowModal(false)}>
          <ModalContainer>
            <AddToPlaylistForm song={song} />
          </ModalContainer>
        </Modal>
      )}
    </React.Fragment>
  )
}
