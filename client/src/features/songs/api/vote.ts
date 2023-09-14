import http from '@/http-common'

export const apiVote = {
  voteUp: async (songId: string) => await http.put<{ message: string }>(`/songs/${songId}/vote`),
  voteDown: async (songId: string) => await http.delete<{ message: string }>(`/songs/${songId}/vote`),
}
