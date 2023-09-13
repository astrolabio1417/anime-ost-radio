import { API, JSON_HEADER } from '@/constants'

export async function voteSong(songId: string, isUp: boolean, authorization: string) {
  const res = await fetch(`${API}/song/${songId}/vote`, {
    method: isUp ? 'put' : 'delete',
    headers: {
      ...JSON_HEADER,
      Authorization: authorization,
    },
  })
  return res.ok
}
