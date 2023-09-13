import { Box, Stack, Typography } from '@mui/material'

interface PlayerCardProps {
  image: string
  title: string
  subtitle: string
  imageSize: number | string
  titleSize?: number | string
  subtitleSize?: number | string
  alignItems?: 'center' | 'flex-start' | 'flex-end'
  titleLineClamp?: number
  subtitleLineClamp?: number
}

export default function PlayerCard(props: PlayerCardProps) {
  const { title, subtitle, image, imageSize, alignItems, titleSize, subtitleSize, titleLineClamp, subtitleLineClamp } =
    props

  return (
    <Stack
      width="100%"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      gap={2}
      position="relative"
      zIndex={1}
      paddingTop={1}
      color="white"
      alignItems={{
        xs: 'center',
        md: alignItems ?? 'flex-end',
      }}
      textAlign={{
        xs: 'center',
        md: 'start',
      }}
      style={{ textShadow: '0px 4px 4px #282828' }}
    >
      {image && (
        <Box
          sx={{
            width: imageSize,
            height: imageSize,
            minWidth: imageSize,
            minHeight: imageSize,
          }}
          overflow="hidden"
          borderRadius={1}
          bgcolor="#0C090A"
        >
          <img src={image} width="100%" height="100%" style={{ objectFit: 'cover' }} />
        </Box>
      )}
      <Box overflow="hidden">
        <Typography
          variant="body1"
          fontSize={titleSize}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: titleLineClamp ?? '3',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          fontSize={subtitleSize}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: subtitleLineClamp ?? '3',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {subtitle?.length ? subtitle : <>&nbsp;</>}
        </Typography>
      </Box>
    </Stack>
  )
}
