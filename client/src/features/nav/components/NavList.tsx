import { Add } from '@mui/icons-material'
import AlbumIcon from '@mui/icons-material/Album'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import SearchIcon from '@mui/icons-material/Search'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import ModalContainer from '@/components/ModalContainer'
import AddSongForm from '@/features/songs/components/AddSongForm'
import { useUser } from '@/zustand/user'

interface NavListProps {
  onLinkClick?: () => void
}

export default function NavList(props: NavListProps) {
  const { isAdmin } = useUser()
  const [showCreateSongForm, setShowCreateSongForm] = useState(false)

  const links = [
    { label: 'Search', href: '/search', icon: <SearchIcon /> },
    { label: 'Shows', href: '/shows', icon: <LiveTvIcon /> },
    { label: 'Artists', href: '/artists', icon: <AlbumIcon /> },
    { label: 'Playlists', href: '/playlists', icon: <QueueMusicIcon /> },
  ]

  function handleClose() {
    setShowCreateSongForm(false)
  }

  return (
    <List>
      {isAdmin && (
        <>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setShowCreateSongForm(true)}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText>Add Song</ListItemText>
            </ListItemButton>
          </ListItem>

          <Modal open={showCreateSongForm} onClose={handleClose}>
            <ModalContainer onClose={handleClose}>
              <Typography variant="subtitle2">Add Song</Typography>
              <AddSongForm />
            </ModalContainer>
          </Modal>
        </>
      )}

      {links.map(item => (
        <ListItem key={item.href} disablePadding>
          <ListItemButton onClick={props.onLinkClick} component={Link} to={item.href}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
