import logger from '@src/logger'
import ApiError, { APIError } from '@src/util/errors/api-error'
import {
  DatabaseError,
  DatabaseKnownClientError,
  DatabaseUnknowClientError,
  DatabaseValidationError,
} from '@src/util/errors/internal-error'
import { Request, Response } from 'express'

export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(
    req: Request,
    res: Response,
    error: unknown,
  ): Response {
    if (
      error instanceof DatabaseValidationError ||
      error instanceof DatabaseKnownClientError ||
      error instanceof DatabaseUnknowClientError
    ) {
      const clientErrors = this.handleClientErrors(error)
      return res.status(clientErrors.code).send(
        ApiError.format({
          path: req.originalUrl,
          code: clientErrors.code,
          message: clientErrors.error,
        }),
      )
    } else {
      logger.error(error)
      return res.status(500).send(
        ApiError.format({
          path: req.originalUrl,
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
      } else if (error.prismaCodeError === 'P2025') {
        return { code: 404, error: error.message }
      }
    }
    return { code: 400, error: error.message }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError))
  }
}
