import { Box, Typography } from '@mui/material'
import React from 'react'

import BannerBackground from '@/assets/banner-background.png'

interface SongBannerProps {
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  bgImage?: string
  image?: string
  category?: 'Artist' | 'Song' | 'Playlist' | 'Show'
}

export default function SongBanner(props: SongBannerProps) {
  const { title, subtitle, bgImage, image, category } = props

  return (
    <Box
      width="100%"
      height={{ xs: 'auto', md: 300 }}
      padding={2}
      maxHeight="100vh"
      display="flex"
      position="relative"
      alignItems="end"
      overflow="hidden"
      bgcolor="black"
    >
      <img
        src={bgImage}
        onError={e => (e.currentTarget.src = BannerBackground)}
        width="100%"
        height="100%"
        style={{
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
          transform: 'scale(1.1)',
          filter: 'blur(3px)',
        }}
        alt=""
      />
      <Box
        position="absolute"
        width="100%"
        height="100%"
        sx={{ background: 'linear-gradient(0deg, rgb(0,0,0,0.4) 20%, rgba(0,0,0,0) 70%)', inset: 0 }}
      />
      <Box
        position="relative"
        color="white"
        width="100%"
        display="flex"
        alignItems={{ xs: 'center', md: 'end' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        textAlign={{ xs: 'center', md: 'start' }}
        gap={2}
      >
        <Box width="200px" height="200px" minWidth="200px" minHeight="200px">
          <img
            onError={e => (e.currentTarget.src = BannerBackground)}
            src={image ?? BannerBackground}
            width="100%"
            height="100%"
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ textShadow: '0px 4px 4px #282828' }}>
          {category && (
            <Typography variant="body2" sx={{ opacity: 0.95 }}>
              {category}
            </Typography>
          )}
          <Typography color="inherit" variant="h4">
            {title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
