import { Box, Button, List, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import Loading from '@/components/Loading'
import TextFieldDebounce from '@/components/TextFieldDebounce'
import { usePlayer } from '@/zustand/player'
import { useUser } from '@/zustand/user'

import { getSongs } from '../api/songs'
import AddToPlaylistAction from '../components/AddToPlaylistAction'
import MusicSpectrumAnimation from '../components/MusicSpectrumAnimation'
import SongItem from '../components/SongItem'
import VoteAction from '../components/VoteAction'

export default function SearchSongs() {
  const { id: userId } = useUser()
  const [queryValue, setQueryValue] = useState('')
  const [page, setPage] = useState(1)
  const { activeSongId, playSong, play } = usePlayer()

  const { data, isLoading } = useQuery({
    queryKey: ['search', queryValue, page],
    queryFn: () => getSongs(queryValue, page),
  })

  function handleSearchFieldChange(value: string) {
    setQueryValue(value)
    setPage(1)
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
        {data?.list.map(song => (
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

      {!isLoading && data?.hasNextPage ? (
        <Button
          title="Load More"
          variant="contained"
          sx={{
            margin: 2,
            marginTop: 0,
          }}
          onClick={() => {
            setPage(prev => prev + 1)
          }}
        >
          Load More
        </Button>
      ) : (
        <></>
      )}
    </Box>
  )
}
