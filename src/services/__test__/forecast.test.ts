import { StormGlass } from '@src/clients/stormGlass'
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'
import { Beach, BeachPosition, Forecast } from '../forecast'

jest.mock('@src/clients/stormGlass')

describe('Forecast Service', () => {
  const defaultBeaches: Beach[] = [
    {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: 'user-1',
    },
  ]
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>
  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture,
    )
    const expectedResponse = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 2,
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 3.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 0.47,
        windDirection: 299.45,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 2,
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T01:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 2,
        swellDirection: 182.56,
        swellHeight: 0.28,
        swellPeriod: 3.44,
        time: '2020-04-26T02:00:00+00:00',
        waveDirection: 232.86,
        waveHeight: 0.46,
        windDirection: 321.5,
        windSpeed: 100,
      },
    ]

    const forecast = new Forecast(mockedStormGlassService)
    const beachesWithRating = await forecast.processForecastForBeaches(
      defaultBeaches,
    )

    expect(beachesWithRating).toEqual(expectedResponse)
  })
})
