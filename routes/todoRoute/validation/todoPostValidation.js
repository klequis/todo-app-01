import {
  // isBoolean,
  isEmpty,
  isISO8601,
  isLength,
  isMongoId,
  isUUID
} from 'validator'
import { toString } from 'lib'
import createError from './createError'

const todoPostValidation = (req, res, next) => {
  const errors = []

  const { params } = req
  const { userid, todoid } = params

  if (!isUUID(toString(userid), 4)) {
    errors.push(createError('params', 'param userid is not valid', 'userid'))
  }

  if (!isMongoId(toString(todoid))) {
    errors.push(
      createError('params', 'param todoid is not valid', 'todoid', 'todoid')
    )
  }
  const { body } = req
  const { dueDate, title, userId } = body
  // due date is not required
  if (!isEmpty(toString(dueDate))) {
    if (!isISO8601(toString(dueDate))) {
      errors.push(
        createError('body', 'dueDate  must be an ISO date string.', 'dueDate')
      )
    }
  }

  if (!isLength(toString(title), { min: 3, max: 30 })) {
    errors.push(
      createError(
        'body',
        'field title must be at least 3 character but not more than 30 characters.',
        'title'
      )
    )
  }
  if (!isUUID(toString(userId), 4)) {
    errors.push(createError('body', 'field userId is not valid', 'userId'))
  }
  if (errors.length > 0) {
    res.status(422).json({
      errors
    })
  } else {
    next()
  }
}

export default todoPostValidation
