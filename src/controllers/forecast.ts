import { ClassMiddleware, Controller, Get } from '@overnightjs/core'
import logger from '@src/logger'
import { authMiddleware } from '@src/middlewares/auth'
import { BeachRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { BeachForecast, Forecast } from '@src/services/forecast'
import { Request, Response } from 'express'
import { BaseController } from '.'

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForeCastController extends BaseController {
  constructor(
    protected beachRepository: BeachRepository = new BeachPrismaRepository(),
    protected forecast: Forecast = new Forecast(),
  ) {
    super()
  }

  @Get('')
  public async getForecastForLoggedUser(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      logger.info('Getting forecast')
      const {
        orderBy,
        orderField,
      }: {
        orderBy?: 'asc' | 'desc'
        orderField?: keyof BeachForecast
      } = req.query

      if (!req.context.userId) {
        logger.error('Missing userId')
        return this.sendErrorResponse(res, {
          path: req.url,
          code: 500,
          message: 'Something went wrong',
        })
      }

      const beaches = await this.beachRepository.find({
        userId: req.context.userId,
      })
      const forecastData = await this.forecast.processForecastForBeaches(
        beaches,
        orderBy,
        orderField,
      )
      logger.info('Returning forecast')
      return res.status(200).send(forecastData)
    } catch (error) {
      return this.sendErrorResponse(res, {
        path: req.url,
        code: 500,
        message: 'Something went wrong.',
      })
    }
  }
}
