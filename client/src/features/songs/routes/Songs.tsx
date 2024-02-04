import { Box, List, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import PageHelmet from '@/components/PageHelmet'
import TextFieldDebounce from '@/components/TextFieldDebounce'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { apiSong } from '../api/songs'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import SongItem from '../components/SongItem'
import VoteAction from '../components/VoteAction'

export default function Songs() {
  const { id: userId } = useUser()
  const [queryValue, setQueryValue] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') ?? '1') ?? 1
  const searchType = searchParams.get('type') ?? 'name'
  const { playSong } = usePlayer()

  const { data, isLoading } = useQuery({
    queryKey: ['search', searchType, queryValue, page],
    queryFn: () => apiSong.songs({ [searchType]: queryValue }, page),
  })
  const searchList = data?.data.docs ?? []

  function handleSearchFieldChange(value: string) {
    setQueryValue(value)
    setSearchParams(params => {
      params.set('page', '1')
      return params
    })
  }

  return (
    <Fragment>
      <PageHelmet title="Search Songs" />
      <Box>
        <Stack gap={2} padding={2} paddingBottom={0}>
          <Typography variant="h6" fontWeight={700}>
            Browse OST Songs
          </Typography>
          <Stack direction="row" gap={1}>
            <Select
              sx={{ boxShadow: 3 }}
              value={searchType}
              label="type"
              title="type"
              onChange={event => {
                setSearchParams(params => {
                  params.set('type', event.target.value as string)
                  return params
                })
              }}
            >
              <MenuItem value="name">Song</MenuItem>
              <MenuItem value="show">Show</MenuItem>
              <MenuItem value="artist">Artist</MenuItem>
            </Select>
            <TextFieldDebounce label="Search" onChange={handleSearchFieldChange} />
          </Stack>
        </Stack>

        {isLoading && <Loading />}

        <List>
          {searchList?.map(song => (
            <SongItem
              key={song._id}
              onClick={() => playSong(song)}
              song={song}
              user={userId}
              secondaryAction={
                <Stack direction="row" gap={1}>
                  <AddToPlaylistAction song={song} />
                  <VoteAction song={song} />
                </Stack>
              }
            />
          ))}
        </List>

        <Stack paddingBottom={2} alignItems="center">
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
      </Box>
    </Fragment>
  )
}
