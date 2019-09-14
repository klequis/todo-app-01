import {
  isBoolean,
  isEmpty,
  isISO8601,
  isLength,
  isMongoId,
  isUUID
} from 'validator'
// import { has } from 'ramda'
import { toString } from 'lib'
import createError from './createError'
import { yellow } from 'logger'

const patchValidation = (req, res, next) => {
  const errors = []

  // params
  const { params } = req
  const { userid, todoid } = params
  if (!isUUID(toString(userid), 4))
    errors.push(createError('params', 'param userid is not valid', 'userid'))
  if (!isMongoId(toString(todoid)))
    errors.push(
      createError('params', 'param todoid is not valid', 'todoid', 'todoid')
    )

  // body
  const { body } = req
      yellow('body', body)
  const {
    _id, // reqired
    title, // required
    userId, // required

    completed, // optional
    dueDate, // optional

    // createdAt, // n/a
    // lastUpdatedAt // n/a
  } = body

  if (!isUUID(toString(userId), 4)) {
    errors.push(createError('body', 'field userId is not valid', 'userId'))
  }

  if (!isMongoId(toString(_id))) {
    errors.push(createError('body', 'field _id is not valid.', '_id'))
  }

  if (!isEmpty(completed)) {
    if (!isBoolean(toString(completed))) {
      errors.push(
        createError('body', 'completed must be true or false.', 'completed')
      )
    }
  }

  if (!isEmpty(toString(dueDate))) {
    if (!isISO8601(toString(dueDate)))
      errors.push(
        createError('body', 'dueDate  must be an ISO date string.', 'dueDate')
      )
  }

  

  if (
    !isLength(toString(title), {
      min: 3,
      max: 30
    })
  ) {
    errors.push(
      createError(
        'body',
        'field title must be at least 3 character but not more than 30 characters.',
        'title'
      )
    )
  }
  // TODO: enable this check here
  // if (!(toString(userid) === toString(userid)))
  //   errors.push(createError('n/a', 'userid in params must match userId in body', 'userId'))

  if (errors.length > 0) {
    res.status(422).json({
      errors
    })
  } else {
    next()
  }
}

export default patchValidation


// if (!isISO8601(toString(createdAt))) {
  //   errors.push(
  //     createError('body', 'createdAt must be an ISO date string.', 'createdAt')
  //   )
  // }

  // due date is not required
  // if (!isISO8601(toString(lastUpdatedAt))) {
  //   errors.push(
  //     createError(
  //       'body',
  //       'lastUpdatedAt must be an ISO date string.',
  //       'lastUpdatedAt'
  //     )
  //   )
  // }