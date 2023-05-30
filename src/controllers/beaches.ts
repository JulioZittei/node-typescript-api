import { Controller, Post } from '@overnightjs/core'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { BeachRepository } from '@src/repositories'

@Controller('beaches')
export class BeachesController {
  constructor(
    protected beachRepository: BeachRepository = new BeachPrismaRepository(),
  ) {}

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = await this.beachRepository.create({ ...req.body })
      res.status(201).send(beach)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        const err = error as Prisma.PrismaClientValidationError
        res.status(422).send({
          error: err.message,
        })
      } else {
        res.status(500).send({
          error: 'Internal Server Error',
        })
      }
    }
  }
}
