import { IPagination } from '@/types'

import { ISong } from '../songs/types'

export interface IPlaylist {
  _id: string
  title: string
  songs: ISong[]
  image: {
    cover?: string
    thumbnail?: string
  }
  user: {
    _id: string
    username: string
  }
}

export interface IPlaylistsResponse extends IPagination {
  docs: IPlaylist[]
}

export type CreatePlaylistI = Omit<IPlaylist, '_id' | 'songs' | 'user'>
