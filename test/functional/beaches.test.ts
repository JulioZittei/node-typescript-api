import { prisma } from '@src/database/client'
import { User } from '@src/models/user'
import { BeachRepository, UserRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import AuthService from '@src/services/auth'

describe('Beaches functional tests', () => {
  const beachRepository: BeachRepository = new BeachPrismaRepository()
  const userRepository: UserRepository = new UserPrismaRepository()
  const defaultUser = {
    name: 'Joe Doe',
    email: 'john@msil.com',
    password: '12345',
  }
  let token: string
  let user: User
  beforeEach(async () => {
    await beachRepository.deleteAll()
    await userRepository.deleteAll()
    user = await userRepository.create(defaultUser)
    token = AuthService.generateToken(user.id as string)
  })
  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        userId: user.id,
      }

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: 'E',
          userId: user.id,
        }),
      )
    })

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        userId: user.id,
      }

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach)
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
        .set({ 'x-access-token': token })
      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        code: 500,
        error: 'Something went wrong.',
      })
    })
  })
})
