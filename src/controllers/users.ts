import { Controller, Post } from '@overnightjs/core'
import { UserRepository } from '@src/repositories'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import { Request, Response } from 'express'
import { BaseController } from '.'

@Controller('users')
export class UsersController extends BaseController {
  constructor(
    protected userRepository: UserRepository = new UserPrismaRepository(),
  ) {
    super()
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = req.body
      const newUser = await this.userRepository.create(user)
      res.status(201).send(newUser)
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }
}
