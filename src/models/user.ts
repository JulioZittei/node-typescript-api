import { User as UserModel } from '@prisma/client'

interface User extends Omit<UserModel, 'id'> {
  id?: string
}

export { User }
