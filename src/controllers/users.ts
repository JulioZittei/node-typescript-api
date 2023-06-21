import { Controller, Get, Middleware, Post } from '@overnightjs/core'
import logger from '@src/logger'
import { UserRepository } from '@src/repositories'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import AuthService from '@src/services/auth'
import { Request, Response } from 'express'
import { BaseController } from '.'
import { authMiddleware } from '@src/middlewares/auth'
import { DatabaseKnownClientError } from '@src/util/errors/internal-error'

@Controller('users')
export class UsersController extends BaseController {
  constructor(
    protected userRepository: UserRepository = new UserPrismaRepository(),
  ) {
    super()
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('Creating user')
      const user = req.body
      const newUser = await this.userRepository.create(user)
      logger.info('Returning user')
      return res.status(201).send(newUser)
    } catch (error) {
      return this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    try {
      logger.info(`Authenticate user ${email}`)
      const user = await this.userRepository.findOne({ email })

      if (!(await AuthService.comparePasswords(password, user.password))) {
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
    } catch (error) {
      if (error instanceof DatabaseKnownClientError) {
        logger.info(`User ${email} not found`)
        return this.sendErrorResponse(res, {
          code: 401,
          message: error.message,
          description: 'Try verifying your email address.',
        })
      }
      return this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const { userId } = req.context

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = await this.userRepository.findOne({
        id: userId,
      })

      return res.status(200).send({ user })
    } catch (error) {
      return this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }
}
