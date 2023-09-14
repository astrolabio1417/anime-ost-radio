import { Box, List, Pagination, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import Loading from '@/components/Loading'
import TextFieldDebounce from '@/components/TextFieldDebounce'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { apiSong } from '../api/songs'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import MusicSpectrumAnimation from '../components/MusicSpectrumAnimation'
import SongItem from '../components/SongItem'
import VoteAction from '../components/VoteAction'

export default function SearchSongs() {
  const { id: userId } = useUser()
  const [queryValue, setQueryValue] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') ?? '1') ?? 1
  const { activeSongId, playSong, play } = usePlayer()

  const { data, isLoading } = useQuery({
    queryKey: ['search', queryValue, page],
    queryFn: () => apiSong.songs(queryValue, page),
  })
  const searchList = data?.data.list ?? []

  function handleSearchFieldChange(value: string) {
    setQueryValue(value)
    setSearchParams(params => {
      params.set('page', '1')
      return params
    })
  }

  return (
    <Box>
      <Stack gap={2} padding={2} paddingBottom={0}>
        <Typography variant="h5">Browse OST Songs</Typography>
        <TextFieldDebounce label="Search Song/Artist/Anime" onChange={handleSearchFieldChange} />
        <Typography variant="overline">Search List</Typography>
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
                {song._id === activeSongId && play && <MusicSpectrumAnimation />}
                <AddToPlaylistAction song={song} />
                <VoteAction song={song} />
              </Stack>
            }
          />
        ))}
      </List>

      <Stack alignItems="center">
        <Pagination
          hideNextButton={!data?.data.hasNextPage}
          hidePrevButton={page <= 1}
          count={data?.data.hasNextPage ? page + 1 : page}
          onChange={(_, page) => {
            setSearchParams(params => {
              params.set('page', `${page}`)
              return params
            })
          }}
        />
      </Stack>
    </Box>
  )
}
