import moment from 'moment'

export function formatDuration(duration: number) {
  if (!duration) return
  return moment.utc(duration * 1000).format('mm:ss') // HH:mm:ss
}

export function validateEmail(email: string) {
  return !!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
}

export function formatSeek(value: number) {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value - minutes * 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function getsongThumbnail(song?: { image: { thumbnail?: string; cover?: string } }) {
  if (!song) return song
  return song.image?.thumbnail ?? song.image?.cover ?? ''
}

export function getSongCover(song?: { image: { thumbnail?: string; cover?: string } }) {
  if (!song) return song
  return song.image?.cover ?? song.image?.thumbnail ?? ''
}

export function getArtistUrlByName(name: string) {
  return `/artists/${btoa(name)}`
}

export function getSongUrlById(id: string) {
  return `/songs/${id}`
}
