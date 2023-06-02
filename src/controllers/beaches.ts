import { Controller, Post } from '@overnightjs/core'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { BeachRepository } from '@src/repositories'
import { BaseController } from '.'

@Controller('beaches')
export class BeachesController extends BaseController {
  constructor(
    protected beachRepository: BeachRepository = new BeachPrismaRepository(),
  ) {
    super()
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = await this.beachRepository.create({ ...req.body })
      res.status(201).send(beach)
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }
}
