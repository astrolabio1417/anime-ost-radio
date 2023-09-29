import { ImageList, ImageListItem, ImageListItemBar, Pagination, Stack, Typography, useMediaQuery } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import BannerBackground from '@/assets/banner-background.png'
import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import TextFieldDebounce from '@/components/TextFieldDebounce'

import { apiPlaylist } from '../api/playlist'

export default function Playlists() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get('page') ?? '1'
  const queryValue = searchParams.get('search') ?? ''

  const { data, isLoading } = useQuery({
    queryKey: ['playlists', page, queryValue],
    queryFn: () => apiPlaylist.lists({ page: page, query: { title: queryValue } }),
  })

  const playlists = data?.data?.docs
  const matches = useMediaQuery('(max-width: 600px)')

  function handleSearchFieldChange(value: string) {
    setSearchParams(params => {
      params.set('search', value)
      params.set('page', '1')
      return params
    })
  }

  return (
    <Fragment>
      <PageHelmet title={'Playlists'} />
      <Stack gap={2} padding={2} paddingBottom={0}>
        <Typography variant="h6" fontWeight={700}>
          Playlists
        </Typography>
        <TextFieldDebounce label="Search" onChange={handleSearchFieldChange} />
      </Stack>

      {isLoading && <Loading />}
      <ImageList sx={{ paddingX: 2 }} cols={matches ? 1 : 2}>
        <>
          {playlists?.map(playlist => (
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
                title={playlist.title ? `${playlist.songs.length} Songs | ${playlist.title}` : 'no title'}
                subtitle={playlist?.user?.username ? `by ${playlist.user.username}` : ''}
                position="below"
              />
            </ImageListItem>
          ))}
        </>
      </ImageList>

      {
        <Stack alignItems="center">
          <Pagination
            hideNextButton={!data?.data.hasNextPage}
            hidePrevButton={!data?.data.hasPrevPage}
            count={data?.data.totalPages}
            onChange={(_, page) => {
              setSearchParams(params => {
                params.set('page', `${page}`)
                return params
              })
            }}
          />
        </Stack>
      }
    </Fragment>
  )
}
