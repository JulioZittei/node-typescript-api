import httpStatusCodes from 'http-status-codes'

export interface APIError {
  path?: string
  code: number
  codeAsString?: string
  message: string
  description?: string
  documentation?: string
}

export interface APIErrorResponse extends Omit<APIError, 'codeAsString'> {
  error: string
}

export default class ApiError {
  public static format(error: APIError): APIErrorResponse {
    return {
      ...(error.path && { path: error.path }),
      code: error.code,
      error: error.codeAsString
        ? error.codeAsString
        : httpStatusCodes.getStatusText(error.code),
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
      message: error.message,
    }
  }
}
