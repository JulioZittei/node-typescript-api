'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.BaseController = void 0
var logger_1 = require('@src/logger')
var internal_error_1 = require('@src/util/errors/internal-error')
var BaseController = /** @class */ (function () {
  function BaseController() {}
  BaseController.prototype.sendCreatedUpdatedErrorResponse = function (
    res,
    error,
  ) {
    if (
      error instanceof internal_error_1.DatabaseValidationError ||
      error instanceof internal_error_1.DatabaseKnownClientError ||
      error instanceof internal_error_1.DatabaseUnknowClientError
    ) {
      var clientErrors = this.handleClientErrors(error)
      res.status(clientErrors.code).send(clientErrors)
    } else {
      logger_1.default.error(error)
      res.status(500).send({
        code: 500,
        error: 'Something went wrong.',
      })
    }
  }
  BaseController.prototype.handleClientErrors = function (error) {
    if (error instanceof internal_error_1.DatabaseKnownClientError) {
      if (error.prismaCodeError === 'P2002') {
        return { code: 409, error: error.message }
      }
    }
    return { code: 422, error: error.message }
  }
  return BaseController
})()
exports.BaseController = BaseController
