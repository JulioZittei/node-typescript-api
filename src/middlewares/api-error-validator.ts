/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'
import ApiError from '@src/util/errors/api-error'

export interface HTTPError extends Error {
  status?: number
}

export function apiErrorValidator(
  error: HTTPError,
  req: Partial<Request>,
  res: Response,
  __: NextFunction,
): void {
  const errorCode = error.status || 500
  res.status(errorCode).json(
    ApiError.format({
      path: req.originalUrl,
      code: errorCode,
      message: error.message,
    }),
  )
}
