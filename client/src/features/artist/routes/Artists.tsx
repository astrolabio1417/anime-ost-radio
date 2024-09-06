import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'

import ListContainer from '@/components/ListContainer'
import PageHelmet from '@/components/PageHelmet'
import { getArtistUrlByName } from '@/helpers'

import { apiArtist } from '../api/artist'

export default function Artists() {
  const { data, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: apiArtist.list,
  })
  const [query, setQuery] = useState('')
  const artists = data?.data?.filter(a => a.toLowerCase().includes(query.toLowerCase())) ?? []

  return (
    <Fragment>
      <PageHelmet title="Artists" />
      <ListContainer
        title="Artists"
        lists={artists?.map(artist => ({ name: artist, url: getArtistUrlByName(artist) }))}
        onSearchChange={(value: string) => setQuery(value)}
        isLoading={isLoading}
      />
    </Fragment>
  )
}
