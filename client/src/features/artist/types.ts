import { ISong } from '../songs/types'

export type IArtistsResponse = string[]

export type IArtistResponse = {
  artist: string
  songs: ISong[]
}
