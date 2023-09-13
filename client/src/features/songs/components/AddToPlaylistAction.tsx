import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'

import Modal from '@/components/Modal'
import { ISong } from '@/features/songs/types'

import AddToPlaylistForm from '../../playlists/components/AddToPlaylistForm'

interface AddToPlaylistActionProps {
  song: ISong
}

export default function AddToPlaylistAction({ song }: AddToPlaylistActionProps) {
  const [cookies] = useCookies(['session'])
  const [showModal, setShowModal] = useState(false)

  function handleClick() {
    if (!cookies.session) return toast('You must be logged in to create a playlist', { type: 'error' })
    setShowModal(true)
  }

  return (
    <React.Fragment>
      <IconButton title="Add to playlist" onClick={handleClick} edge="end" aria-label="playlist" color="inherit">
        <PlaylistAddIcon />
      </IconButton>

      {showModal && (
        <Modal style={{ width: '100%', maxWidth: '600px' }} isOpen={showModal} onClose={() => setShowModal(false)}>
          <AddToPlaylistForm song={song} />
        </Modal>
      )}
    </React.Fragment>
  )
}
