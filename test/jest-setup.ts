import { SetupServer } from '@src/server'
import 'module-alias-jest/register'
import supertest from 'supertest'

let server: SetupServer

beforeAll(async () => {
  server = new SetupServer()
  await server.init()
  global.testRequest = supertest(server.getApp())
})
