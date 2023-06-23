import './util/module-alias'
import { Server } from '@overnightjs/core'
import { ForeCastController } from '@src/controllers/forecast'
import express, { Application } from 'express'
import * as http from 'http'
import { BeachesController } from './controllers/beaches'
import { UsersController } from './controllers/users'
import logger from './logger'
import expressPino from 'express-pino-logger'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import apiSchema from './api.schema.json'
import * as OpenApiValidator from 'express-openapi-validator'
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'
import { apiErrorValidator } from './middlewares/api-error-validator'

export class SetupServer extends Server {
  private server?: http.Server
  constructor(private port = 3000) {
    super()
  }

  public async init(): Promise<void> {
    this.setupExpress()
    this.docsSetup()
    this.setupControllers()
    this.setupErrorHandlers()
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port)
    })
  }

  public async close(): Promise<void> {
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err)
          }
          resolve(true)
        })
      })
    }
  }

  public getApp(): Application {
    return this.app
  }

  private setupExpress(): void {
    this.app.use(express.json())
    this.app.use(express.text())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(
      cors({
        origin: '*',
      }),
    )
    this.app.use(
      expressPino({
        logger,
      }),
    )
  }

  private docsSetup(): void {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema))
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document,
        validateRequests: true,
        validateResponses: true,
      }),
    )
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator)
  }

  private setupControllers(): void {
    const forecastController = new ForeCastController()
    const beachesController = new BeachesController()
    const usersController = new UsersController()
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ])
  }
}
