import { isValidDate, isValidAuth0UserId } from 'lib'
import { isMongoId, isUUID } from 'validator'
import { findOne } from 'db'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { blue } from 'logger'

export const completedCheck = {
  in: ['body'],
  errorMessage: 'Completed must be true or false.',
  isBoolean: {}
}

export const createdAtCheck = {
  in: ['body'],
  errorMessage: 'createdAt is not a valid date.',
  custom: {
    options: value => isValidDate(value)
  }
}

export const dueDateCheck = {
  in: ['body'],
  errorMessage: 'Due date is not a valid date.',
  custom: {
    options: value => isValidDate(value, true)
  }
}

export const lastUpdatedAtCheck = {
  in: ['body'],
  errorMessage: 'lastUpdatedAt is not a valid date.',
  custom: {
    options: value => isValidDate(value)
  }
}

export const mongoIdInParamsCheck = {
  in: ['params'],
  errorMessage: 'Parameter id must be a valid MongodDB hex string.',
  custom: {
    options: value => isMongoId(value)
  }
}

export const mongoIdInBodyCheck = {
  in: ['body'],
  errorMessage: 'Parameter id must be a valid MongodDB hex string.',
  custom: {
    options: value => isMongoId(value)
  }
}

export const titleLengthCheck = {
  in: ['body'],
  errorMessage: 'Title must be at least 3 characters long.',
  isLength: {
    options: { min: 3 }
  }
}

const isDefinedAndString = value => {
  if (value === undefined || typeof value !== 'string') {
    return false
  }
  return true
}

export const userIdInParamsCheck = {
  errorMessage: 'Unknown user.',
  in: ['params'],
  custom: {
    options: async (value, { req, location, path }) => {
      // blue('userIdInParamsCheck: value', value)
      // blue('userIdInParamsCheck: location', location)
      // blue('userIdInParamsCheck: path', path)
      // if value = undefined isUUID will error its
      // own error message which will be returned and
      // not the intended message.
      // Therefore check for undefined and typof string in advance
      if (!isDefinedAndString(value)) {
        throw errMsg
      }
      if (!isUUID(value)) {
        blue('userIdInParamsCheck: THROW')
        throw 'Unknown user.'
      }
      // const exists = await userExists(value)
      // blue('userIdCheck: exists', exists)
      // if(!exists) {
      //   throw('Unknown user.')
      // }
      return true
    }
  }
}

export const userIdInBodyCheck = {
  errorMessage: 'Unknown user.',
  in: ['body'],
  custom: {
    options: async (value, { req, location, path }) => {
      const errMsg = 'Unknown user.'
      // blue('userIdInBodyCheck: value', value)
      // blue('userIdInBodyCheck: location', location)
      // blue('userIdInBodyCheck: path', path)

      // if value = undefined isUUID will error its
      // own error message which will be returned and
      // not the intended message.
      // Therefore check for undefined and typof string in advance
      if (!isDefinedAndString(value)) {
        throw errMsg
      }
      const uuid = isUUID(value, 4)
      blue('UUID', uuid)
      if (!uuid) {
        blue('userIdInBodyCheck: THROW')
        throw errMsg
      }
      return true
    }
  }
}
