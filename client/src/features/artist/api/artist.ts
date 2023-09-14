import { API } from '@/constants'
import http from '@/http-common'

import { IArtistResponse, IArtistsResponse } from '../types'

export const apiArtist = {
  list: async () => await http.get<IArtistsResponse>(`${API}/artists`),
  get: async (artist: string) => await http.get<IArtistResponse>(`${API}/artists/${artist}`),
}
