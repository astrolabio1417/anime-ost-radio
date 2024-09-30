import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

interface AppNavTitleProps {
  onClick?: () => void
}

export default function AppNavTitle(props: AppNavTitleProps) {
  return (
    <Typography
      onClick={props.onClick}
      color="inherit"
      fontSize={{ xs: '0.9rem', sm: '1.1rem' }}
      fontWeight={600}
      component={Link}
      to="/"
      sx={{ textDecoration: 'none' }}
    >
      AnimeMusic
    </Typography>
  )
}
