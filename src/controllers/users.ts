import { Controller, Post } from '@overnightjs/core'
import logger from '@src/logger'
import { UserRepository } from '@src/repositories'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import AuthService from '@src/services/auth'
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
      logger.info('Creating user')
      const user = req.body
      const newUser = await this.userRepository.create(user)
      logger.info('Returning user')
      res.status(201).send(newUser)
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    logger.info(`Authenticate user ${email}`)
    const user = await this.userRepository.findOne({ email })

    if (!user) {
      logger.info(`User ${email} not found`)

      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      })
    }

    if (!(await AuthService.comparePasswords(password, user?.password))) {
      logger.info(`Password does not match`)
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!',
      })
    }

    logger.info('User authenticated')
    const token = AuthService.generateToken(user.id as string)

    logger.info('Returning user')
    return res.status(200).send({
      token,
    })
  }
}
