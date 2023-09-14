import { ISong } from '../songs/types'

export interface IShowResponse {
  songs: ISong[]
  show: string
}

export type IShowsResponse = string[]
