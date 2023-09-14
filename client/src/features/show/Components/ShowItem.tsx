import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'
import { ListChildComponentProps } from 'react-window'

export default function ShowItem({ data, index, style }: ListChildComponentProps) {
  return (
    <ListItem key={data[index]} style={style} component="div" disablePadding>
      <ListItemButton component={Link} to={`/shows/${btoa(encodeURIComponent(data[index]))}`}>
        <ListItemText primary={data[index]} />
      </ListItemButton>
    </ListItem>
  )
}
