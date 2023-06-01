import { Beach, GeoPosition } from '@src/models/beach'
import { BeachRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import apiForecastResponse1Beach from '@test/fixtures/api_forecast_response_1_beach.json'
import nock from 'nock'

describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    const beachRepository: BeachRepository = new BeachPrismaRepository()
    await beachRepository.deleteAll()
    const defaultBeach: Beach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
      userId: 'user-1',
    }
    await beachRepository.create(defaultBeach)
  })
  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
        end: /(.*)/,
      })
      .reply(200, stormGlassWeather3HoursFixture)

    const { body, status } = await global.testRequest.get('/forecast')
    expect(status).toBe(200)
    expect(body).toEqual(apiForecastResponse1Beach)
  })

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v1/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong')

    const { status } = await global.testRequest.get(`/forecast`)

    expect(status).toBe(500)
  })
})
