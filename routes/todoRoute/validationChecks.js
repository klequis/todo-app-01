import { isValidDate, isValidAuth0UserId } from 'lib'
import { isMongoId } from 'validator'
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

export const mongoIdCheck = {
  in: ['params'],
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

export const userIdCheck = {
  errorMessage: 'Unknown user.',
  custom: {
    options: value => isValidAuth0UserId(value)
  }
}
