import { User } from '@src/models/user'
import { BeachRepository, UserRepository } from '@src/repositories'
import { BeachPrismaRepository } from '@src/repositories/beachRepository'
import { UserPrismaRepository } from '@src/repositories/userRepository'
import AuthService from '@src/services/auth'

describe('Users functional tests', () => {
  const beachRepository: BeachRepository = new BeachPrismaRepository()
  const userRepository: UserRepository = new UserPrismaRepository()
  beforeEach(async () => {
    await beachRepository.deleteAll()
    await userRepository.deleteAll()
  })
  describe('When creating a new user with encrypted password', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'Joe Doe',
        email: 'john@mail.com',
        password: '12345',
      }

      const response = await global.testRequest.post('/users').send(newUser)
      expect(response.status).toBe(201)
      await expect(
        AuthService.comparePasswords(newUser.password, response.body.password),
      ).resolves.toBeTruthy()
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        }),
      )
    })
  })

  it('Should return a validation error', async () => {
    const newUser = {
      email: 'john@mail.com',
      password: '12345',
    }
    const response = await global.testRequest.post('/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      path: '/users',
      code: 400,
      error: 'Bad Request',
      message: expect.stringContaining(
        'Argument name for data.name is missing.',
      ),
    })
  })

  it('Should return 409 when the email already exists', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '12345',
    }
    await global.testRequest.post('/users').send(newUser)
    const response = await global.testRequest.post('/users').send(newUser)

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      path: '/users',
      code: 409,
      error: 'Conflict',
      message: expect.stringContaining(
        'Unique constraint failed on the constraint: `users_email_key`',
      ),
    })
  })

  describe('When authenticating a user', () => {
    it('should generate a token for valid user', async () => {
      const newUser: User = {
        name: 'Joe Doe',
        email: 'john@msil.com',
        password: '12345',
      }

      const user = await userRepository.create(newUser)
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password })

      const Jwtalims = AuthService.decodeToken(response.body.token)
      console.log(response.body.token)

      expect(response.status).toBe(200)
      expect(Jwtalims).toMatchObject({ sub: user.id })
    })

    it('Should return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '12345',
      }
      await userRepository.create(newUser)
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: 'different password' })

      expect(response.status).toBe(401)
    })
  })

  describe('When getting user profile info', () => {
    it(`Should return the token's owner profile information`, async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = await userRepository.create(newUser)
      const token = AuthService.generateToken(user.id as string)
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ 'x-access-token': token })

      expect(status).toBe(200)
      expect(body).toMatchObject(JSON.parse(JSON.stringify({ user })))
    })

    it(`Should return Not Found, when the user is not found`, async () => {
      //create a new user but don't save it
      const token = AuthService.generateToken('649344220cf5d2711d0ae0e1')
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ 'x-access-token': token })

      expect(status).toBe(404)
      expect(body.message).toBe('No User found')
    })
  })
})
