import { Prisma } from '@prisma/client'
import logger from '@src/logger'
import { Beach } from '@src/models/beach'
import { User } from '@src/models/user'
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
      logger.error(
        'ClientKnownRequestError happened to the database: ',
        error.message,
      )
      throw new DatabaseKnownClientError(error.message, error.code)
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      logger.error(
        'ClientValidationError happened to the database: ',
        error.message,
      )
      throw new DatabaseValidationError(error.message)
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      logger.error(
        'ClientUnknownRequestError happened to the database: ',
        error.message,
      )
      throw new DatabaseUnknowClientError(error.message)
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      logger.error(
        'ClientInitializationError: happened to the database: ',
        error.message,
      )
      throw new DatabaseInitializationError(error.message)
    } else {
      logger.error(
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

export type UserRepository = BaseRepository<User>
