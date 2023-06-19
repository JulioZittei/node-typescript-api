import './util/module-alias'
import { Server } from '@overnightjs/core'
import { ForeCastController } from '@src/controllers/forecast'
import express, { Application } from 'express'
import { BeachesController } from './controllers/beaches'
import * as http from 'http'
import { UsersController } from './controllers/users'

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
      console.log('Server listening on port: ' + this.port)
    })
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
      usersController
    ])
  }
}
