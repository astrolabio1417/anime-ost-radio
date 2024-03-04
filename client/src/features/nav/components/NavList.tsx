import AlbumIcon from '@mui/icons-material/Album'
import HomeIcon from '@mui/icons-material/Home'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import SearchIcon from '@mui/icons-material/Search'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

interface NavListProps {
  onLinkClick?: () => void
}

export default function NavList(props: NavListProps) {
  const links = [
    { label: 'Search', href: '/search', icon: <SearchIcon /> },
    { label: 'Shows', href: '/shows', icon: <LiveTvIcon /> },
    { label: 'Artists', href: '/artists', icon: <AlbumIcon /> },
    { label: 'Playlists', href: '/playlists', icon: <QueueMusicIcon /> },
  ]

  return (
    <List>
      {links.map(item => (
        <ListItem key={item.href} disablePadding>
          <ListItemButton onClick={props.onLinkClick} component={Link} to={item.href}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
      <Divider />
    </List>
  )
}
