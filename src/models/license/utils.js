import { some } from 'lodash'

const ERRORS = {
  '400': 'Bad request. Invalid data',
  '401': 'Unauthorized. It lacks valid authentication credentials for the target resource',
  '409': 'Conflict with the current state of the target resource',
  '422': 'Unprocessable entity. Field is required'
}

/**
 * Return a valid http error code from the error
 */
function getValidHttpErrorCode (err) {
  var errorCode
  if (err.code && String(err.code).match(/[1-5][0-5][0-9]$/)) {
    errorCode = parseInt(err.code)
  } else {
    errorCode = 500
  }
  return errorCode
}

function handleValidationError (err, _res, next) {
  if (err) {
    if (err.name === 'ValidationError') {
      // If any validation error is due to required fields, respond with 422
      if (some(err.errors, function (error) {
        return error.name === 'ValidatorError' &&
                        error.properties.type === 'required'
      })) {
        next(getErrorFromCode(422))
      } else { // Other errors are due to invalid data, respond with 400
        next(getErrorFromCode(400))
      }
    } else if (err.name === 'CastError') {
      next(getErrorFromCode(400))
    } else {
      const error = new Error()
      error.code = 500
      error.message = 'Error while saving licenses'

      next(error)
    }
  } else {
    next()
  }
}

function handleDuplicateKeyError (err, _doc, next) {
  if (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      next(getErrorFromCode(409))
    } else {
      const error = new Error()
      // Set error code and message if not already set by handleValidationError
      error.code = err.code || 500
      error.message = err.message || 'Error while saving licenses'

      next(error)
    }
  } else {
    next()
  }
}

function getErrorFromCode (errCode) {
  var error = new Error()
  error.code = errCode
  error.message = ERRORS[errCode.toString()] || 'Unsupported error code'

  return error
}

export { getValidHttpErrorCode, handleValidationError, handleDuplicateKeyError }
