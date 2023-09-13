import { Box } from '@mui/material'
import React from 'react'

import BannerBackground from '@/assets/banner-background.png'

import PlayerCard from './PlayerCard'

interface BannerProps {
  title: string
  image?: string
  bgImage?: string
  subtitle?: string
  children?: React.ReactNode
}

export default function Banner(props: BannerProps) {
  return (
    <Box
      position="relative"
      bgcolor="#0C090A"
      width="100%"
      padding={2}
      color="white"
      style={{ textShadow: '2px 4px 3px rgba(0,0,0,0.3)' }}
      overflow="hidden"
    >
      <Box
        style={{
          backgroundImage: `url(${props?.bgImage?.length ? props?.bgImage : BannerBackground})`,
          inset: 0,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          filter: 'blur(5px) brightness(80%)',
          transform: 'scale(1.04)',
        }}
        width="100%"
        height="100%"
        position="absolute"
        zIndex={0}
      />
      <PlayerCard
        title={props.title}
        subtitle={props.subtitle ?? ''}
        image={props.image?.length ? props.image : BannerBackground}
        imageSize={200}
        titleSize={32}
        subtitleSize={14}
      />
    </Box>
  )
}
