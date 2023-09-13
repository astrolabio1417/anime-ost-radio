import CircleIcon from '@mui/icons-material/Circle'
import { Button, Typography } from '@mui/material'
import { red } from '@mui/material/colors'

interface LiveTextProps {
  onClick?: () => void
}

export default function LiveText(props: LiveTextProps) {
  return (
    <Button
      title="Live"
      onClick={props.onClick}
      sx={{ color: red[500], padding: 0, height: 'auto', bgcolor: 'transparent' }}
      startIcon={<CircleIcon fontSize="small" color="inherit" />}
    >
      <Typography variant="body2">Live</Typography>
    </Button>
  )
}
