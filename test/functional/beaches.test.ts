import { prisma } from '@src/database/client'

describe('Beaches functional tests', () => {
  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        userId: 'user-1',
      }

      const response = await global.testRequest.post('/beaches').send(newBeach)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: 'E',
          userId: 'user-1',
        }),
      )
    })

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        userId: 'user-1',
      }

      const response = await global.testRequest.post('/beaches').send(newBeach)
      expect(response.status).toBe(422)
      expect(response.body).toEqual(
        expect.objectContaining({
          code: 422,
          error: expect.stringContaining(
            "Argument lat: Got invalid value 'invalid_string' on prisma.createOneBeach. Provided String, expected Float.",
          ),
        }),
      )
    })

    it('should return 500 when there is any error other than validation error', async () => {
      jest.spyOn(prisma.beach, 'create').mockRejectedValueOnce({
        message: 'fail to create beach',
      })
      const newBeach = {
        lat: -33.792726,
        lng: 46.43243,
        name: 'Manly',
        position: 'E',
      }

      const response = await global.testRequest
        .post('/beaches')
        .send(newBeach)
        .set({ 'x-access-token': 'fake-token' })
      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        code: 500,
        error: 'Something went wrong.',
      })
    })
  })
})
