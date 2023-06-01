import { Beach } from '@src/models/beach'

import { prisma } from '@src/database/client'
import { BeachRepository, FilterOptions } from '.'

class BeachPrismaRepository implements BeachRepository {
  async create(data: Beach): Promise<Beach> {
    const beach = await prisma.beach.create({
      data,
    })
    return Beach.create(beach)
  }

  async findOne(filter: FilterOptions): Promise<Beach> {
    const beach = await prisma.beach.findUniqueOrThrow({
      where: filter,
    })

    return Beach.create(beach)
  }

  async find(filter: FilterOptions): Promise<Beach[]> {
    const beaches = await prisma.beach.findMany({
      where: filter,
    })

    return beaches.map((beach) => Beach.create(beach))
  }

  async deleteAll() {
    await prisma.beach.deleteMany()
  }

  async findAllBeachesForUser(userId: string): Promise<Beach[]> {
    const beaches = await prisma.beach.findMany({
      where: {
        userId,
      },
    })

    return beaches.map((beach) => Beach.create(beach))
  }
}

export { BeachPrismaRepository }
