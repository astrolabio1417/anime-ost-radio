import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { Slider, Stack } from '@mui/material'
import { IconButton } from '@mui/material'

import { SliderMainStyle } from '../style'

interface VolumeProps {
  volume?: number
  onChange?: (e: Event, newValue: number | number[]) => void
  onClick?: () => void
}

export default function Volume(props: VolumeProps) {
  const { onChange, onClick, volume } = props
  return (
    <Stack gap={1} alignItems="center" direction="row" width="100%">
      <IconButton sx={{ padding: 0 }} title="Volume" color="inherit" onClick={onClick}>
        {volume === 0 ? <VolumeOffIcon /> : (volume || 0) <= 0.49 ? <VolumeDownIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider sx={SliderMainStyle} min={0} max={1.0} value={volume} step={0.1} onChange={onChange} />
    </Stack>
  )
}
