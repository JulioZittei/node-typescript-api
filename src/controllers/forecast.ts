import { Controller, Get } from '@overnightjs/core'
import { BeachRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { Forecast } from '@src/services/forecast'
import { Request, Response } from 'express'
import { BaseController } from '.'

@Controller('forecast')
export class ForeCastController extends BaseController {
  constructor(
    protected beachRepository: BeachRepository = new BeachPrismaRepository(),
    protected forecast: Forecast = new Forecast(),
  ) {
    super()
  }

  @Get('')
  public async getForecastForLoggedUser(
    _: Request,
    res: Response,
  ): Promise<void> {
    try {
      const beaches = await this.beachRepository.find({})
      const forecastData = await this.forecast.processForecastForBeaches(
        beaches,
      )
      res.status(200).send(forecastData)
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error)
    }
  }
}
