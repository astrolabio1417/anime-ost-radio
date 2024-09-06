import { Box, Stack, Typography } from '@mui/material'

import BannerBackground from '@/assets/banner-background.png'

interface PlayerCardProps {
  image?: string
  title: string
  subtitle: string
}

export default function PlayerCard(props: PlayerCardProps) {
  const { title, subtitle, image } = props

  return (
    <Stack
      width="100%"
      direction={{ xs: 'column', sm: 'row' }}
      gap={2}
      display="flex"
      zIndex={1}
      color="white"
      justifyContent={{ xs: 'center', sm: 'flex-start' }}
      alignItems="center"
      textAlign={{ xs: 'center', sm: 'start' }}
      style={{ textShadow: '0px 4px 4px #282828' }}
    >
      <Box
        display={{ xs: 'none', sm: 'block' }}
        width={70}
        height={70}
        maxWidth={70}
        maxHeight={70}
        overflow="hidden"
        borderRadius={1}
        bgcolor="#0C090A"
        minWidth="50px"
      >
        <img src={image || BannerBackground} width="100%" height="100%" style={{ objectFit: 'cover' }} />
      </Box>

      <Box
        display={{ xs: 'block', sm: 'none' }}
        width="100%"
        height="100%"
        overflow="hidden"
        borderRadius={1}
        bgcolor="#0C090A"
      >
        <img src={image || BannerBackground} width="100%" height="100%" style={{ objectFit: 'cover' }} />
      </Box>

      <Box
        overflow="hidden"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
        }}
      >
        <Typography lineHeight="1.2" variant="body1">
          {title}
        </Typography>
        <Typography variant="caption"> {subtitle}</Typography>
      </Box>
    </Stack>
  )
}
