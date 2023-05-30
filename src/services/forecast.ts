import { ForecastPoint, StormGlass } from '@src/clients/stormGlass'
import { Beach } from '@src/models/beach'
import { InternalError } from '@src/util/errors/internal-error'

interface BeachForecast extends Omit<Beach, 'userId'>, ForecastPoint {}

interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}

class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = []
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
        const enrichedBeachData = this.enrichBeachData(points, beach)
        pointsWithCorrectSources.push(...enrichedBeachData)
      }
      return this.mapForecastByTime(pointsWithCorrectSources)
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }

  private enrichBeachData(points: ForecastPoint[], beach: Beach) {
    return points.map((e) => ({
      ...e,
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: 2,
    }))
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time)
      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        })
      }
    }
    return forecastByTime
  }
}

export { BeachForecast, ForecastProcessingInternalError, Forecast }
