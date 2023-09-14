import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import ListContainer from '@/components/ListContainer'

import { apiArtist } from '../api/artist'

export default function Artists() {
  const { data, isLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: apiArtist.list,
  })
  const [query, setQuery] = useState('')
  const artists = data?.data?.filter(a => a.toLowerCase().includes(query.toLowerCase())) ?? []

  return (
    <ListContainer
      title="Artists"
      lists={artists?.map(a => ({ name: a, url: `/artists/${btoa(encodeURIComponent(a))}` }))}
      onSearchChange={(value: string) => setQuery(value)}
      isLoading={isLoading}
    />
  )
}
