import { prisma } from '@src/database/client'
import logger from '@src/logger'
import { User } from '@src/models/user'
import AuthService from '@src/services/auth'
import {
  AbstractErrorHandlerRepository,
  FilterOptions,
  UserRepository,
} from '.'

class UserPrismaRepository
  extends AbstractErrorHandlerRepository
  implements UserRepository
{
  async create(data: User): Promise<User> {
    let hashedPassword = ''

    if (data?.id) {
      const { id, ...rest } = data
      const existsUser = await this.findOne({ id })

      try {
        hashedPassword = await AuthService.hashPassword(data.password)
      } catch (error) {
        logger.error(
          `Error hashing the password for the user ${data.name}`,
          error,
        )
      }

      try {
        return await prisma.user.update({
          where: {
            id,
          },
          data: {
            ...rest,
            password:
              data.password !== existsUser.password
                ? hashedPassword
                : data.password,
          },
        })
      } catch (error) {
        this.handleError(error)
      }
    }

    try {
      hashedPassword = await AuthService.hashPassword(data.password)
    } catch (error) {
      logger.error(
        `Error hashing the password for the user ${data.name}`,
        error,
      )
    }

    try {
      const createdUser = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })

      return createdUser
    } catch (error) {
      this.handleError(error)
    }
  }

  async findOne(filter: FilterOptions): Promise<User> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: filter,
      })
      return user
    } catch (error) {
      this.handleError(error)
    }
  }

  async find(filter: FilterOptions): Promise<User[]> {
    try {
      const users = await prisma.user.findMany({
        where: filter,
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
