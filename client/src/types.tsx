export interface IPagination {
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  prevPage: number | null
  pagingCounter: number
  totalDocs: number
  totalPages: number
}
