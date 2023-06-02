import { User } from '@src/models/user'
import { Beach } from '@src/models/beach'
import { Prisma } from '@prisma/client'
import {
  DatabaseInitializationError,
  DatabaseInternalError,
  DatabaseKnownClientError,
  DatabaseUnknowClientError,
  DatabaseValidationError,
} from '@src/util/errors/internal-error'

export type FilterOptions = Record<string, unknown>

export interface BaseRepository<T> {
  create(data: T): Promise<T>
  findOne(filter: FilterOptions): Promise<T | undefined>
  find(filter: FilterOptions): Promise<T[]>
  deleteAll(): Promise<void>
}

export abstract class AbstractErrorHandlerRepository {
  protected handleError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(
        'ClientKnownRequestError happened to the database: ',
        error.message,
      )
      throw new DatabaseKnownClientError(error.message, error.code)
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error(
        'ClientValidationError happened to the database: ',
        error.message,
      )
      throw new DatabaseValidationError(error.message)
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      console.error(
        'ClientUnknownRequestError happened to the database: ',
        error.message,
      )
      throw new DatabaseUnknowClientError(error.message)
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error(
        'ClientInitializationError: happened to the database: ',
        error.message,
      )
      throw new DatabaseInitializationError(error.message)
    } else {
      console.error(
        'Something unexpected happened to the database: ',
        (error as Error).message,
      )
      throw new DatabaseInternalError((error as Error).message)
    }
  }
}

export interface BeachRepository extends BaseRepository<Beach> {
  findAllBeachesForUser(userId: string): Promise<Beach[]>
}

export interface UserRepository extends BaseRepository<User> {}
