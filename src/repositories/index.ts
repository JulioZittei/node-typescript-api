import { Beach } from '@src/models/beach'

export type FilterOptions = Record<string, unknown>

export interface BaseRepository<T> {
  create(data: T): Promise<T>
  findOne(filter: FilterOptions): Promise<T | undefined>
  find(filter: FilterOptions): Promise<T[]>
  deleteAll(): Promise<void>
}

export interface BeachRepository extends BaseRepository<Beach> {
  findAllBeachesForUser(userId: string): Promise<Beach[]>
}
