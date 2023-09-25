import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import {
  Avatar,
  Box,
  ButtonGroup,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Modal,
  Typography,
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import ModalContainer from '@/components/ModalContainer'
import { useUserPlaylists } from '@/zustand/playlist'

import { apiPlaylist } from '../api/playlist'
import { IPlaylist, IPlaylistDataForm, IPlaylistUpdateResponseError } from '../types'
import DeletePlaylistForm from './DeletePlaylistForm'
import PlaylistForm from './PlaylistForm'

interface PlaylistListItemProps {
  onLinkClick?: () => void
  playlist: IPlaylist
}

export default function PlaylistListItem(props: PlaylistListItemProps) {
  const { playlist } = props
  const [edit, setEdit] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const btnId = `playlist-${playlist._id}-btn`

  async function handleSubmit(data: IPlaylistDataForm) {
    const toastId = toast.loading('Updating playlist...')
    try {
      const newPlaylist = await apiPlaylist.update(playlist._id, data)
      toast.update(toastId, {
        render: newPlaylist?.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      })
      useUserPlaylists.getState().updatePlaylist(playlist._id, newPlaylist.data.playlist)
      newPlaylist.data.playlist && props.onLinkClick?.()
    } catch (err) {
      const error = err as AxiosError<IPlaylistUpdateResponseError>

      toast.update(toastId, {
        render: error.response?.data.message ?? error.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  }

  return (
    <ListItem
      sx={{ [`:hover #${btnId}`]: { visibility: 'visible' } }}
      secondaryAction={
        <ButtonGroup>
          <IconButton className="edit-btn" id={btnId} sx={{ visibility: 'hidden' }} onClick={() => setEdit(p => !p)}>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton id={btnId} sx={{ visibility: 'hidden' }} onClick={() => setDeleteModal(p => !p)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ButtonGroup>
      }
      disablePadding
    >
      <ListItemButton component={!edit ? Link : Box} onClick={props.onLinkClick} to={`/playlists/${playlist._id}`}>
        <ListItemAvatar>
          <Avatar variant="square" src={playlist.image?.thumbnail} sx={{ bgcolor: blue[700] }}>
            {playlist?.title?.substring(0, 2)}
          </Avatar>
        </ListItemAvatar>

        <ListItemText primary={playlist.title} />
      </ListItemButton>
      {deleteModal && (
        <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
          <ModalContainer>
            <DeletePlaylistForm playlistId={playlist._id} onClose={() => setDeleteModal(false)} />
          </ModalContainer>
        </Modal>
      )}
      {edit && (
        <Modal open={edit} onClose={() => setEdit(false)}>
          <ModalContainer>
            <Typography variant="overline">Edit Playlist</Typography>
            <PlaylistForm
              initialData={{
                title: playlist.title,
                image: {
                  cover: playlist?.image?.cover ?? null,
                  thumbnail: playlist?.image?.thumbnail ?? null,
                },
              }}
              buttonTitle="Update"
              onSubmit={handleSubmit}
            />
          </ModalContainer>
        </Modal>
      )}
    </ListItem>
  )
}
