import { API } from '@/constants'
import http from '@/http-common'

import { IShowResponse, IShowsResponse } from '../types'

export const apiShow = {
  list: async () => await http.get<IShowsResponse>(`${API}/shows`),
  get: async (show: string) => await http.get<IShowResponse>(`${API}/shows/${show}`),
}
