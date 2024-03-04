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

export interface IPlaylistDataForm {
  title: string
  image: {
    cover: FileList | string | null
    thumbnail: FileList | string | null
  }
}

export interface IPlaylistsResponse extends IPagination {
  docs: IPlaylist[]
}

export interface IPlaylistCreateResponse {
  message: string
  playlist: IPlaylist
}

export interface IPlaylistCreateResponseError {
  message: string
  playlistId: IPlaylist
}

export interface IPlaylistUpdateResponse {
  message: string
  playlist: IPlaylist
}

export interface IPlaylistUpdateResponseError {
  message: string
  playlistId: string
}

export interface IPlaylistSongUpdateResponse {
  message: string
  playlistId: string
  songId: string
}
