import { IPagination } from '@/types'

export type ISongListResponse = {
  docs: ISong[]
} & IPagination

export type ISong = {
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
