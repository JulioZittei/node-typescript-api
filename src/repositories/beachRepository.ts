import { Beach } from '@src/models/beach'

import { prisma } from '@src/database/client'
import {
  AbstractErrorHandlerRepository,
  BeachRepository,
  FilterOptions,
} from '.'

class BeachPrismaRepository
  extends AbstractErrorHandlerRepository
  implements BeachRepository
{
  async create(data: Beach): Promise<Beach> {
    try {
      const beach = await prisma.beach.create({
        data,
      })
      return Beach.create(beach)
    } catch (error) {
      this.handleError(error)
    }
  }

  async findOne(filter: FilterOptions): Promise<Beach> {
    try {
      const beach = await prisma.beach.findUniqueOrThrow({
        where: filter,
      })
      return Beach.create(beach)
    } catch (error) {
      this.handleError(error)
    }
  }

  async find(filter: FilterOptions): Promise<Beach[]> {
    try {
      const beaches = await prisma.beach.findMany({
        where: filter,
      })
      return beaches.map((beach) => Beach.create(beach))
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteAll() {
    try {
      await prisma.beach.deleteMany()
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAllBeachesForUser(userId: string): Promise<Beach[]> {
    try {
      const beaches = await prisma.beach.findMany({
        where: {
          userId,
        },
      })
      return beaches.map((beach) => Beach.create(beach))
    } catch (error) {
      this.handleError(error)
    }
  }
}

export { BeachPrismaRepository }
