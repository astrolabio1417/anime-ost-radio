export type ISongListResponse = {
  list: ISong[]
  total: number
  limit: number
  page: number
  hasNextPage: boolean
}

export type ISong = {
  _id: string
  sourceId: string
  musicUrl: string
  name: string
  duration?: number
  artist?: string
  show: {
    name?: string
    id?: string
  }
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
