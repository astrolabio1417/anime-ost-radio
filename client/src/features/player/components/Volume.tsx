import { Slider, Stack } from '@mui/material'

import VolumeIconButton from './VolumeIconButton'

interface VolumeProps {
  volume?: number
  onChange?: (e: Event, newValue: number | number[]) => void
  onClick?: () => void
}

export default function Volume(props: VolumeProps) {
  const { onChange, onClick, volume } = props
  return (
    <Stack gap={1} alignItems="center" direction="row" width="100%">
      <VolumeIconButton onClick={onClick} volume={volume ?? 1} />
      <Slider
        sx={{
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
            backgroundColor: '#fff',
            '&::before': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
            },
            '&:hover, &.Mui-focusVisible, &.Mui-active': {
              boxShadow: 'none',
            },
          },
        }}
        min={0}
        max={1.0}
        value={volume}
        step={0.1}
        onChange={onChange}
      />
    </Stack>
  )
}
