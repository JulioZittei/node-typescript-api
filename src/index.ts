import 'module-alias-jest/register'
import { SetupServer } from '@src/server'

const server = new SetupServer()

server.init()
server.start()
