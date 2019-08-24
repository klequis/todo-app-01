import {
  isBoolean,
  isEmpty,
  isISO8601,
  isLength,
  isMongoId,
  isUUID
} from 'validator'
import { toString } from 'lib'
import createError from './createError'
import { blue } from 'logger'

const validation = (req, res, next) => {
  const errors = []
  const method = req.method
  blue('method', method)
  const { body, params } = req

  const { userid, todoid } = params

  // params ---
  if (!isUUID(toString(userid), 4)) {
    errors.push(
      createError('params', '001: param userid is not valid', 'userid')
    )
  }

  // no good way to differentiate GET from GET :todoid
  // therefore somewhat lengthy if statement
  if (
    method === 'PATCH' ||
    method === 'DELETE' ||
    (method === 'GET' && !isEmpty(todoid))
  ) {
    if (!isMongoId(toString(todoid))) {
      errors.push(
        createError('params', '003: param todoid is not valid', 'todoid')
      )
    }
  }

  // body ---
  const {
    _id,
    completed,
    createdAt,
    dueDate,
    lastUpdatedAt,
    title,
    userId
  } = body

  if (method === 'PATCH') {
    if (!isMongoId(toString(_id))) {
      errors.push(createError('body', '006: field _id is not valid.', '_id'))
    }
    if (!isBoolean(toString(completed))) {
      errors.push(
        createError(
          'body',
          '004: completed must be true or false.',
          'completed'
        )
      )
    }
    if (!isISO8601(toString(createdAt))) {
      errors.push(
        createError(
          'body',
          '005: createdAt must be an ISO date string.',
          'createdAt'
        )
      )
    }
    if (!isISO8601(toString(lastUpdatedAt))) {
      errors.push(
        createError(
          'body',
          '002: lastUpdatedAt must be an ISO date string.',
          'lastUpdatedAt'
        )
      )
    }
  }

  if (method === 'POST' || method === 'PATCH') {
    // due date is not required
    blue('isEmpty', isEmpty(toString(dueDate)))
    if (!isEmpty(toString(dueDate))) {
      blue('** it is not empty')  
      if (!isISO8601(toString(dueDate)))
        errors.push(
          createError(
            'body',
            '008: dueDate must be an ISO date string.',
            'dueDate'
          )
        )
    }
    if (!isLength(toString(title), { min: 3, max: 30 })) {
      errors.push(
        createError(
          'body',
          '009: field title must be at least 3 character but not more than 30 characters.',
          'title'
        )
      )
    }
    if (!isUUID(toString(userId), 4)) {
      errors.push(
        createError('body', '010: field userId is not valid', 'userId')
      )
    }
  }
  // should this go here or should I throw if it isn't correct
  // if (!(toString(userid) === toString(userid)))
  //   errors.push(createError('n/a', 'userid in params must match userId in body', 'userId'))

  if (errors.length > 0) {
    blue('errors', errors)
    res.status(422).json({
      errors
    })
  } else {
    next()
  }
}

export default validation
