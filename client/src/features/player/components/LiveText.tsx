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
      sx={{
        color: red[500],
        padding: '0 !important',
        height: 'auto',
        bgcolor: 'transparent',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        Live
      </Typography>
    </Button>
  )
}
