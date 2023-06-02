import { UserRepository } from '@src/repositories'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import AuthService from '@src/services/auth'

describe('Users functional tests', () => {
  beforeEach(async () => {
    const userRepository: UserRepository = new UserPrismaRepository()
    await userRepository.deleteAll()
  })
  describe('When creating a new user with encrypted password', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'Joe Doe',
        email: 'john@msil.com',
        password: '1234',
      }

      const response = await global.testRequest.post('/users').send(newUser)
      expect(response.status).toBe(201)
      await expect(
        AuthService.comparePasswords(response.body.password, newUser.password),
      ).resolves.toBeTruthy()
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        }),
      )
    })
  })

  it('Should return 422 when there is a validation error', async () => {
    const newUser = {
      email: 'john@mail.com',
      password: '1234',
    }
    const response = await global.testRequest.post('/users').send(newUser)

    expect(response.status).toBe(422)
    expect(response.body).toEqual({
      code: 422,
      error: expect.stringContaining('Argument name for data.name is missing.'),
    })
  })

  it('Should return 409 when the email already exists', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    }
    await global.testRequest.post('/users').send(newUser)
    const response = await global.testRequest.post('/users').send(newUser)

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      code: 409,
      error: expect.stringContaining(
        'Unique constraint failed on the constraint: `User_email_key`',
      ),
    })
  })
})
