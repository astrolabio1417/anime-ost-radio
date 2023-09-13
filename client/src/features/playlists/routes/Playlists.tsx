import { ImageList, ImageListItem, ImageListItemBar, Typography, useMediaQuery } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import BannerBackground from '@/assets/banner-background.png'

import { getPlaylists } from '../api/playlist'

export default function Playlists() {
  const [page] = useState(1)
  const { data } = useQuery({
    queryKey: ['playlists', page],
    queryFn: () => getPlaylists({}),
  })
  const matches = useMediaQuery('(max-width: 600px)')

  return (
    <>
      <Typography paddingX={2} paddingTop={2} variant="h5">
        Playlists
      </Typography>
      <ImageList cols={matches ? 1 : 2}>
        <>
          {data?.map(playlist => (
            <ImageListItem
              component={Link}
              sx={{ textDecoration: 'none', color: 'inherit' }}
              to={`/playlists/${playlist._id}`}
              key={playlist._id}
            >
              <img
                style={{ maxHeight: '300px' }}
                src={playlist.image?.cover ?? playlist.image?.thumbnail ?? BannerBackground}
                alt={playlist.title}
                loading="lazy"
              />
              <ImageListItemBar
                sx={{ paddingX: 1 }}
                title={playlist.title ?? 'no title'}
                subtitle={playlist?.user?.username ?? ''}
                position="below"
              />
            </ImageListItem>
          ))}
        </>
      </ImageList>
    </>
  )
}
