import { SxProps } from '@mui/material'
import { Theme } from '@mui/system'

export const SliderMainStyle: SxProps<Theme> = {
  height: 0.01,
  '& .MuiSlider-thumb': {
    display: 'none',
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    '&::before': { boxShadow: '0 4px 8px rgba(0,0,0,0.4)' },
    '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: 'none' },
  },
  '&:hover .MuiSlider-thumb': {
    display: 'block',
  },
  '&:hover': {
    height: 0.2,
  },
}
