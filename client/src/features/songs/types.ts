import { IPagination } from '@/types'

export interface ISongListResponse extends IPagination {
  docs: ISong[]
}

export interface ISong {
  _id: string
  sourceId: string
  musicUrl: string
  name: string
  duration?: number
  artist?: string
  show?: string
  image: {
    cover?: string
    thumbnail?: string
  }
  played: boolean
  vote: {
    list: string[]
    total: number
    timestamp?: Date
  }
  timestamp?: string
}
