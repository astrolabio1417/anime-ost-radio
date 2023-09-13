import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { IconButton } from '@mui/material'

interface VolumeIconButtonProps {
  volume: number
  onClick?: () => void
}

export default function VolumeIconButton(props: VolumeIconButtonProps) {
  const { volume } = props

  return (
    <IconButton title="Volume" color="inherit" onClick={props.onClick}>
      {volume === 0 ? <VolumeOffIcon /> : volume <= 0.49 ? <VolumeDownIcon /> : <VolumeUpIcon />}
    </IconButton>
  )
}
