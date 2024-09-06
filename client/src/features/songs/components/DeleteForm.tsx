import { Button, ButtonGroup, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { apiSong } from '../api/songs'

interface Props {
  onClose?: () => void
  songId: string
}

export default function DeleteSongForm(props: Props) {
  const { songId, onClose } = props
  const navigate = useNavigate()

  async function handleDelete() {
    const res = await apiSong.delete(songId)
    res.data.deletedCount && navigate('/')
  }

  return (
    <form>
      <Typography variant="subtitle2" mb={2}>
        Are you sure you want to delete this song?
      </Typography>
      <Typography variant="body2" mb={2}>
        This will delete the song, You cannot undo this action.
      </Typography>
      <ButtonGroup>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  )
}
