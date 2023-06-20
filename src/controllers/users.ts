import { Controller, Post } from '@overnightjs/core'
import { UserRepository } from '@src/repositories'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import { Request, Response } from 'express'
import { BaseController } from '.'
import AuthService from '@src/services/auth'

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

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    const user = await this.userRepository.findOne({ email })

    if (!user) {
      return res.status(401).send({
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      })
    }

    if (!(await AuthService.comparePasswords(password, user?.password))) {
      return res.status(401).send({
        code: 401,
        message: 'Password does not match!',
      })
    }

    const token = AuthService.generateToken(user.id as string)

    return res.status(200).send({
      token,
    })
  }
}
