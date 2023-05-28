import 'module-alias-jest/register'
import { Server } from '@overnightjs/core'
import { ForeCastController } from '@src/controllers/forecast'
import express, { Application } from 'express'

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super()
  }

  public init(): void {
    this.setupExpress()
    this.setupControllers()
  }

  public getApp(): Application {
    return this.app
  }

  private setupExpress(): void {
    this.app.use(express.json())
  }

  private setupControllers(): void {
    const forecastController = new ForeCastController()
    this.addControllers([forecastController])
  }
}
