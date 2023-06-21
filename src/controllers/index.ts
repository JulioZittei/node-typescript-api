import logger from '@src/logger'
import ApiError, { APIError } from '@src/util/errors/api-error'
import {
  DatabaseError,
  DatabaseKnownClientError,
  DatabaseUnknowClientError,
  DatabaseValidationError,
} from '@src/util/errors/internal-error'
import { Response } from 'express'

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
      res.status(clientErrors.code).send(
        ApiError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        }),
      )
    } else {
      logger.error(error)
      res.status(500).send(
        ApiError.format({
          code: 500,
          message: 'Something went wrong.',
        }),
      )
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

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError))
  }
}
