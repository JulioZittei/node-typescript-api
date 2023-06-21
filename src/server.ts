import './util/module-alias'
import { Server } from '@overnightjs/core'
import { ForeCastController } from '@src/controllers/forecast'
import express, { Application } from 'express'
import * as http from 'http'
import { BeachesController } from './controllers/beaches'
import { UsersController } from './controllers/users'
import logger from './logger'

export class SetupServer extends Server {
  private server?: http.Server
  constructor(private port = 3000) {
    super()
  }

  public async init(): Promise<void> {
    this.setupExpress()
    this.setupControllers()
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
