import { useQuery } from '@tanstack/react-query'
import { Fragment, useState } from 'react'

import ListContainer from '@/components/ListContainer'
import PageHelmet from '@/components/PageHelmet'
import { getShowUrlByName } from '@/helpers'

import { apiShow } from '../api/show'

export default function Shows() {
  const { data, isLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: apiShow.list,
  })
  const [query, setQuery] = useState('')
  const shows = data?.data?.filter(a => a.toLowerCase().includes(query.toLowerCase())) ?? []

  return (
    <Fragment>
      <PageHelmet title="Anime Shows" />
      <ListContainer
        title="Shows"
        lists={shows?.map(show => ({ name: show, url: getShowUrlByName(show) }))}
        onSearchChange={(value: string) => setQuery(value)}
        isLoading={isLoading}
      />
    </Fragment>
  )
}
