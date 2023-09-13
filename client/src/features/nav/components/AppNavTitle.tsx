import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

interface AppNavTitleProps {
  onClick?: () => void
}

export default function AppNavTitle(props: AppNavTitleProps) {
  return (
    <Typography
      onClick={props.onClick}
      variant="body2"
      color="inherit"
      fontSize={20}
      fontFamily={'cursive'}
      component={Link}
      to="/"
      sx={{
        textDecoration: 'none',
      }}
    >
      AniGroove
    </Typography>
  )
}
