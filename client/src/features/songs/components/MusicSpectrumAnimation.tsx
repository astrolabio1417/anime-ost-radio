import { Icon } from '@mui/material'
import Lottie from 'lottie-react'

import musicSpectrum from '@/assets/musicSpectrum.json'

export default function MusicSpectrumAnimation() {
  return (
    <Icon sx={{ margin: 'auto', paddingBottom: 4 }}>
      <Lottie animationData={musicSpectrum} loop={true} style={{ height: 25 }} />
    </Icon>
  )
}
