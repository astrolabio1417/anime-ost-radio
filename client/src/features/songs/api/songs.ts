import { API, JSON_HEADER } from '@/constants'

import { ISong, ISongListResponse } from '../types'

export async function getSongs(query?: string, page: number = 1): Promise<ISongListResponse> {
  const url = new URL(`${API}/song`)
  query && url.searchParams.set('search', query)
  url.searchParams.set('page', page.toString())
  const res = await fetch(url.toString(), {
    headers: JSON_HEADER,
  })
  return await res.json()
}

export async function getSong(songId: string): Promise<ISong> {
  const url = new URL(`${API}/song/${songId}`)
  const res = await fetch(url.toString(), {
    headers: JSON_HEADER,
  })
  return await res.json()
}
