/*
    Used by:
    - routes/todoRoute/index.js
    - server/index.js

*/

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
import { findOne } from 'db'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { isEmpty as ramdaIsEmpty } from 'ramda'

import { blue } from 'logger'

const userExists = async userId => {
  const r = await findOne(TODO_COLLECTION_NAME, { userId: userId }, { _id: 1 })
  blue('userExists: r', r)
  return !ramdaIsEmpty(r)
}

const validation = async (req, res, next) => {
  const errors = []

  const method = req.method

  const { body, params } = req
  blue('validation: body', body)
  blue('validation: params', params)
  const { userid, todoid } = params

  const {
    _id,
    completed,
    createdAt,
    dueDate,
    lastUpdatedAt,
    title,
    userId
  } = body

  // All requests must have a userid in params so check this first
  if (!isUUID(toString(userid), 4)) {
    blue('userid', userid)
    errors.push(
      createError('params', '001: param userid is not valid', 'userid')
    )
  }

  // For PATCH and POST 'userId' in body must match 'userid' in params
  if (method === 'PATCH' || method === 'POST') {
    if (userId !== userid) {
      errors.push(createError('', '0012: unmatched user iDs', ''))
    }
  }

  const exists = await userExists(userid)
  blue('exists', exists)
  if (!exists) {
    errors.push(createError('params', '011: unknown user', 'userid'))
  }

  // no good way to differentiate GET from GET :todoid
  // therefore somewhat lengthy if statement
  if (
    method === 'PATCH' ||
    method === 'DELETE' ||
    (method === 'GET' && !isEmpty(toString(todoid)))
  ) {
    if (!isMongoId(toString(todoid))) {
      errors.push(
        createError('params', '003: param todoid is not valid', 'todoid')
      )
    }
  }

  // body ---

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
    if (!isEmpty(toString(dueDate))) {
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
      blue('userId', userId)
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
