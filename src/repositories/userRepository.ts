import { prisma } from '@src/database/client'
import { User } from '@src/models/user'
import {
  UserRepository,
  FilterOptions,
  AbstractErrorHandlerRepository
} from '.'
import AuthService from '@src/services/auth'

class UserPrismaRepository
  extends AbstractErrorHandlerRepository
  implements UserRepository
{
  async create(data: User): Promise<User> {
    try {
      if (data?.id) {
        const { id, ...rest } = data
        const existsUser = await this.findOne({ id })

        return await prisma.user.update({
          where: {
            id
          },
          data: {
            ...rest,
            password:
              data.password !== existsUser.password
                ? await AuthService.hashPassword(data.password)
                : data.password
          }
        })
      }

      const createdUser = await prisma.user.create({
        data: {
          ...data,
          password: await AuthService.hashPassword(data.password)
        }
      })

      return createdUser
    } catch (error) {
      this.handleError(error)
    }
  }

  async findOne(filter: FilterOptions): Promise<User> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: filter
      })
      return user
    } catch (error) {
      this.handleError(error)
    }
  }

  async find(filter: FilterOptions): Promise<User[]> {
    try {
      const users = await prisma.user.findMany({
        where: filter
      })
      return users
    } catch (error) {
      this.handleError(error)
    }
  }

  async deleteAll() {
    try {
      await prisma.user.deleteMany()
    } catch (error) {
      this.handleError(error)
    }
  }
}

export { UserPrismaRepository }
