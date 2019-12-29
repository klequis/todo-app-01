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
  return !ramdaIsEmpty(r)
}

const checkIfUUID = id => isUUID(toString(id), 4)

const checkIfMongoId = id => isMongoId(toString(id))

const checkIdsAreEqual = (idParam, idBody) =>
  toString(idParam) === toString(idBody)

const checkCompletedIsBoolean = (completed, optional = false) => {
  const str = toString(completed)
  if (optional && isEmpty(str)) return true
  return isBoolean(str)
}

const checkDueDateIsDate = (dueDate, optional = false) => {
  const str = toString(dueDate)
  if (optional && isEmpty(str)) return true
  return isISO8601(str)
}

const checkTitleLength = (title, optional = false) => {
  const str = toString(title)
  if (optional && isEmpty(str)) return true
  return isLength(str, {
    min: 3,
    max: 30
  })
}

const validation = async (req, res, next) => {
  const errors = []

  const method = req.method

  const { body, params } = req

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
    errors.push(
      createError('params', '001: param userid is not valid', 'userid')
    )
  }


  // param.userid must already exist
  const exists = await userExists(userid)

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

  // PATCH
  if (method === 'PATCH') {
    // required: isMongoId(params.todoid)
    if (!checkIfMongoId(todoid)) {
      errors.push(
        createError('params', '003: param todoid is not valid', 'todoid')
      )
    }
    // required: isUUID(body.userId)
    if (!checkIfUUID) {
      errors.push(
        createError('body', '010: field userId is not valid', 'userId')
      )
    }
    // required: params.userid===body.userId
    if (!checkIdsAreEqual(userid, userId)) {
      errors.push(createError('', '0012: unmatched user iDs', ''))
    }
    // required: isMongoID(body._id)
    if (!checkIfMongoId(_id)) {
      errors.push(createError('body', '006: field _id is not valid.', '_id'))
    }
    // optional: isBoolean(body.completed)
    if (!checkCompletedIsBoolean(completed, true)) {
      errors.push(
        createError(
          'body',
          '004: completed must be true or false.',
          'completed'
        )
      )
    }
    // optional: isDate(body.dueDate)
    if (!checkDueDateIsDate(dueDate, true)) {
      errors.push(
        createError(
          'body',
          '008: dueDate must be an ISO date string.',
          'dueDate'
        )
      )
    }
    // optional: body.title.length >=3 && <=30
    if (!checkTitleLength(title, true)) {
      createError(
        'body',
        '009: field title must be at least 3 character but not more than 30 characters.',
        'title'
      )
    }
  }
  // POST
  if (method === 'POST') {
    // required: isUUID(body.userId)
    if (!checkIfUUID) {
      errors.push(
        createError('body', '010: field userId is not valid', 'userId')
      )
    }
    // required: params.userid===body.userId
    if (!checkIdsAreEqual(userid, userId)) {
      errors.push(createError('', '0012: unmatched user iDs', ''))
    }
    // optional: isBoolean(body.completed)
    if (!checkCompletedIsBoolean(completed, true)) {
      errors.push(
        createError(
          'body',
          '004: completed must be true or false.',
          'completed'
        )
      )
    }

    // optional: isDate(body.dueDate)
    // optional: isDate(body.dueDate)
    if (!checkDueDateIsDate(dueDate, true)) {

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
          '008: dueDate must be an ISO date string.',
          'dueDate'
        )
      )
    }
    // required: body.title.length >=3 && <=30
    if (!checkTitleLength(title, false)) {
      createError(
        'body',
        '009: field title must be at least 3 character but not more than 30 characters.',
        'title'
      )
    }
  }
  // DELETE
  if (method === 'DELETE') {
    // required: isMongoID(params.todoid)
    if (!checkIfMongoId(todoid)) {
      errors.push(
        createError('params', '003: param todoid is not valid', 'todoid')
      )
    }
  }

  // GetByID
  if (method === 'GET' && !isEmpty(toString(todoid))) {
    if (!checkIfMongoId(todoid)) {
      // required: isMongoID(params.todoid)
      errors.push(
        createError('params', '003: param todoid is not valid', 'todoid')
      )
    }
  }
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