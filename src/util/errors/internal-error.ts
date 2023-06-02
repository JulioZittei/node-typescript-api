export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string,
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class DatabaseValidationError extends DatabaseError {}

export class DatabaseKnownClientError extends DatabaseError {
  prismaCodeError: string
  constructor(message: string, prismaCodeError: string) {
    super(message)
    this.prismaCodeError = prismaCodeError
  }
}

export class DatabaseUnknowClientError extends DatabaseError {}

export class DatabaseInitializationError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}
