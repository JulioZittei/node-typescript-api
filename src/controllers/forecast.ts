import { Controller, Get } from '@overnightjs/core'
import { BeachRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { Forecast } from '@src/services/forecast'
import { Request, Response } from 'express'

@Controller('forecast')
export class ForeCastController {
  constructor(
    protected beachRepository: BeachRepository = new BeachPrismaRepository(),
    protected forecast: Forecast = new Forecast(),
  ) {}

  @Get('')
  public async getForecastForLoggedUser(
    _: Request,
    res: Response,
  ): Promise<void> {
    const beaches = await this.beachRepository.find({})
    const forecastData = await this.forecast.processForecastForBeaches(beaches)
    res.status(200).send(forecastData)
  }
}
