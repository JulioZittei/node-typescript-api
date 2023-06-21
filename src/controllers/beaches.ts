import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import logger from '@src/logger'
import { authMiddleware } from '@src/middlewares/auth'
import { BeachRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { Request, Response } from 'express'
import { BaseController } from '.'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  constructor(
    protected beachRepository: BeachRepository = new BeachPrismaRepository(),
  ) {
    super()
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('Creating beach')
      const beach = await this.beachRepository.create({
        ...req.body,
        userId: req.context.userId,
      })
      logger.info('Returning beach')
      return res.status(201).send(beach)
    } catch (error) {
      return this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }
}
