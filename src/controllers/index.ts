import { Response } from 'express'
import {
  DatabaseError,
  DatabaseKnownClientError,
  DatabaseUnknowClientError,
  DatabaseValidationError,
} from '@src/util/errors/internal-error'

export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(
    res: Response,
    error: unknown,
  ): void {
    if (
      error instanceof DatabaseValidationError ||
      error instanceof DatabaseKnownClientError ||
      error instanceof DatabaseUnknowClientError
    ) {
      const clientErrors = this.handleClientErrors(error)
      res.status(clientErrors.code).send(clientErrors)
    } else {
      res.status(500).send({
        code: 500,
        error: 'Something went wrong.',
      })
    }
  }

  private handleClientErrors(error: DatabaseError): {
    code: number
    error: string
  } {
    if (error instanceof DatabaseKnownClientError) {
      if (error.prismaCodeError === 'P2002') {
        return { code: 409, error: error.message }
      }
    }
    return { code: 422, error: error.message }
  }
}
