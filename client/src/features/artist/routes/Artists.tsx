import { Box, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import Loading from '@/components/Loading'
import TextFieldDebounce from '@/components/TextFieldDebounce'

import { getArtists } from '../api/artist'
import ArtistList from '../components/ArtistList'

export default function Artists() {
  const { data, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: getArtists,
  })
  const [query, setQuery] = useState('')

  return (
    <Box width="100%">
      <Stack gap={2} padding={2} paddingBottom={0}>
        <Typography variant="h5">Artists</Typography>
        <TextFieldDebounce label="Search Song/Artist/Anime" onChange={(value: string) => setQuery(value)} />
        <Typography variant="overline">List</Typography>
      </Stack>

      {isLoading && <Loading />}

      <Box
        width="100%"
        sx={{
          '& > .no-scrollbars': {
            width: 'auto !important',
          },
        }}
      >
        <ArtistList artists={data?.filter(a => a.toLowerCase().includes(query.toLowerCase())) ?? []} />
      </Box>
    </Box>
  )
}
