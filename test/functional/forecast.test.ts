import { Beach, GeoPosition } from '@src/models/beach'
import { BeachRepository, UserRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import AuthService from '@src/services/auth'
import apiForecastResponse1Beach from '@test/fixtures/api_forecast_response_1_beach.json'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import nock from 'nock'
import CacheUtil from '@src/util/cache'

describe('Beach forecast functional tests', () => {
  const userRepository: UserRepository = new UserPrismaRepository()
  const beachRepository: BeachRepository = new BeachPrismaRepository()

  const defaultUser = {
    name: 'Joe Doe',
    email: 'john@mail.com',
    password: '12345',
  }
  let token: string
  beforeEach(async () => {
    await beachRepository.deleteAll()
    await userRepository.deleteAll()
    const user = await userRepository.create(defaultUser)
    const defaultBeach: Beach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
      userId: user.id as string,
    }
    await beachRepository.create(defaultBeach)
    token = AuthService.generateToken(user.id as string)
    CacheUtil.clearAllCache()
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

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token })
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

    const { status, body } = await global.testRequest
      .get(`/forecast`)
      .set({ 'x-access-token': token })

    console.log(body)

    expect(status).toBe(500)
  })
})
