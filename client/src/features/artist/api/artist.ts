import { API } from '@/constants'

import { IArtistResponse, IArtistsResponse } from '../types'

export async function getArtists() {
  const res = await fetch(`${API}/artists`)
  const data = (await res.json()) as IArtistsResponse
  return data
}

export async function getArtist(artist: string) {
  const res = await fetch(`${API}/artists/${artist}`)
  const data = (await res.json()) as IArtistResponse
  return data
}
