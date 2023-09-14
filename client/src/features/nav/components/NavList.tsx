import AlbumIcon from '@mui/icons-material/Album'
import HomeIcon from '@mui/icons-material/Home'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import SearchIcon from '@mui/icons-material/Search'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

interface NavListProps {
  color?: string
  onLinkClick?: () => void
}

export default function NavList(props: NavListProps) {
  return (
    <List>
      <ListItem
        onClick={props.onLinkClick}
        component={Link}
        to="/"
        sx={{ color: props?.color ?? 'inherit' }}
        disablePadding
      >
        <ListItemButton>
          <ListItemIcon sx={{ color: props?.color ?? 'inherit' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>
      <ListItem
        onClick={props.onLinkClick}
        component={Link}
        to="/search"
        sx={{ color: props?.color ?? 'inherit' }}
        disablePadding
      >
        <ListItemButton>
          <ListItemIcon sx={{ color: props?.color ?? 'inherit' }}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItemButton>
      </ListItem>
      <ListItem
        onClick={props.onLinkClick}
        component={Link}
        to="/shows"
        sx={{ color: props?.color ?? 'inherit' }}
        disablePadding
      >
        <ListItemButton>
          <ListItemIcon sx={{ color: props?.color ?? 'inherit' }}>
            <LiveTvIcon />
          </ListItemIcon>
          <ListItemText primary="Shows" />
        </ListItemButton>
      </ListItem>
      <ListItem
        onClick={props.onLinkClick}
        component={Link}
        to="/playlists"
        sx={{ color: props?.color ?? 'inherit' }}
        disablePadding
      >
        <ListItemButton>
          <ListItemIcon sx={{ color: props?.color ?? 'inherit' }}>
            <QueueMusicIcon />
          </ListItemIcon>
          <ListItemText primary="Playlists" />
        </ListItemButton>
      </ListItem>
      <ListItem
        onClick={props.onLinkClick}
        component={Link}
        to="/artists"
        sx={{ color: props?.color ?? 'inherit' }}
        disablePadding
      >
        <ListItemButton>
          <ListItemIcon sx={{ color: props?.color ?? 'inherit' }}>
            <AlbumIcon />
          </ListItemIcon>
          <ListItemText primary="Artists" />
        </ListItemButton>
      </ListItem>
      <Divider sx={{ bgcolor: props?.color ?? 'inherit' }} />
    </List>
  )
}
