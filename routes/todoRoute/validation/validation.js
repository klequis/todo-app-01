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
  // blue('userExists: userId', userId)
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
  // blue('method', method)

  const { body, params } = req
  blue('body', body)

  const { userid, todoid } = params
  blue('params', params)

  const {
    _id,
    completed,
    createdAt,
    dueDate,
    lastUpdatedAt,
    title,
    userId
  } = body

  // ALL (covers GET as well)

  // param.userid is a UUID
  if (!checkIfUUID(userid)) {
    errors.push(
      createError('params', '001: param userid is not valid', 'userid')
    )
  }

  // param.userid must already exist
  const exists = await userExists(userid)
  if (!exists) {
    errors.push(createError('params', '011: unknown user', 'userid'))
  }

  // PATCH
  // required: isMongoId(params.todoid)
  if (!checkIfMongoId(todoid)) {
    errors.push(
      createError('params', '003: param todoid is not valid', 'todoid')
    )
  }
  // required: isUUID(body.userId)
  if (!checkIfUUID) {
    errors.push(createError('body', '010: field userId is not valid', 'userId'))
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
      createError('body', '004: completed must be true or false.', 'completed')
    )
  }
  // optional: isDate(body.dueDate)
  if (!checkDueDateIsDate(dueDate, true)) {
    errors.push(
      createError('body', '008: dueDate must be an ISO date string.', 'dueDate')
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

  // POST
  // required: isUUID(body.userId)
  if (!checkIfUUID) {
    errors.push(createError('body', '010: field userId is not valid', 'userId'))
  }
  // required: params.userid===body.userId
  if (!checkIdsAreEqual(userid, userId)) {
    errors.push(createError('', '0012: unmatched user iDs', ''))
  }
  // optional: isBoolean(body.completed)
  if (!checkCompletedIsBoolean(completed, true)) {
    errors.push(
      createError('body', '004: completed must be true or false.', 'completed')
    )
  }
  // optional: isDate(body.dueDate)
  // optional: isDate(body.dueDate)
  if (!checkDueDateIsDate(dueDate, true)) {
    errors.push(
      createError('body', '008: dueDate must be an ISO date string.', 'dueDate')
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
  // DELETE
  // required: isMongoID(params.todoid)
  if (!checkIfMongoId(todoid)) {
    errors.push(
      createError('params', '003: param todoid is not valid', 'todoid')
    )
  }

  // GetByID
  // required: isMongoID(params.todoid)
  if (!checkIfMongoId(todoid)) {
    errors.push(
      createError('params', '003: param todoid is not valid', 'todoid')
    )
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

// /* Rules which need to be inforced

//   ALL
//   1. REQUIRED: params.userid is a UUID
//   1. REQUIRED: user must already exist

//   PATCH || POST
//   1. REQUIRED: body.userId is a UUID
//   1. REQUIRED: params.userid === body.userId

//   PATCH || DELETE || GetById
//   1. REQUIRED: params.todoid is a MongoID

//   PATCH
//   1. REQUIRED: body._id is a MongoID
//   1. OPTIONAL: body.completed is a boolean

//   POST || PATCH
//   1. OPTIONAL body.dueDate is a date
//   1. REQUIRED: body.title length(>=3 and <=30)

// */

// import {
//   isBoolean,
//   isEmpty,
//   isISO8601,
//   isLength,
//   isMongoId,
//   isUUID
// } from 'validator'
// import { toString } from 'lib'
// import createError from './createError'
// import { findOne } from 'db'
// import { TODO_COLLECTION_NAME } from 'db/constants'
// import { isEmpty as ramdaIsEmpty } from 'ramda'

// import { blue } from 'logger'

// const userExists = async userId => {
//   // blue('userExists: userId', userId)
//   const r = await findOne(TODO_COLLECTION_NAME, { userId: userId }, { _id: 1 })
//   return !ramdaIsEmpty(r)
// }

// const validation = async (req, res, next) => {
//   const errors = []

//   const method = req.method
//   // blue('method', method)

//   const { body, params } = req
//   blue('body', body)

//   const { userid, todoid } = params
//   blue('params', params)

//   const {
//     _id,
//     completed,
//     createdAt,
//     dueDate,
//     lastUpdatedAt,
//     title,
//     userId
//   } = body

//   // params ---
//   if (!isUUID(toString(userid), 4)) {
//     errors.push(
//       createError('params', '001: param userid is not valid', 'userid')
//     )
//   }

//   // userid must already exist
//   const exists = await userExists(userid)
//   if (!exists) {
//     errors.push(createError('params', '011: unknown user', 'userid'))
//   }

//   // userId in body must match userid in params
//   if (method === 'PATCH' || method === 'POST') {
//     if (!isUUID(toString(userId), 4)) {
//       blue('userId', userId)
//       errors.push(
//         createError('body', '010: field userId is not valid', 'userId')
//       )
//     }
//     if (userId !== userid) {
//       errors.push(createError('', '0012: unmatched user iDs', ''))
//     }
//   }

//   // \todoid must be a valid mongodb _id
//   if (
//     method === 'PATCH' ||
//     method === 'DELETE' ||
//     (method === 'GET' && !isEmpty(toString(todoid)))
//   ) {
//     if (!isMongoId(toString(todoid))) {
//       errors.push(
//         createError('params', '003: param todoid is not valid', 'todoid')
//       )
//     }
//   }

//   // body ---

//   if (method === 'PATCH') {
//     if (!isMongoId(toString(_id))) {
//       errors.push(createError('body', '006: field _id is not valid.', '_id'))
//     }

//     if (!isEmpty(toString(completed))) { // completed is options
//       if (!isBoolean(toString(completed))) {
//         errors.push(
//           createError(
//             'body',
//             '004: completed must be true or false.',
//             'completed'
//           )
//         )
//       }
//     }

//     // if (!isISO8601(toString(createdAt))) {
//     //   errors.push(
//     //     createError(
//     //       'body',
//     //       '005: createdAt must be an ISO date string.',
//     //       'createdAt'
//     //     )
//     //   )
//     // }
//     // if (!isISO8601(toString(lastUpdatedAt))) {
//     //   errors.push(
//     //     createError(
//     //       'body',
//     //       '002: lastUpdatedAt must be an ISO date string.',
//     //       'lastUpdatedAt'
//     //     )
//     //   )
//     // }
//   }

//   if (method === 'POST' || method === 'PATCH') {
//     // due date is not required
//     if (!isEmpty(toString(dueDate))) {
//       if (!isISO8601(toString(dueDate)))
//         errors.push(
//           createError(
//             'body',
//             '008: dueDate must be an ISO date string.',
//             'dueDate'
//           )
//         )
//     }
//     if (
//       !isLength(toString(title), {
//         min: 3,
//         max: 30
//       })
//     ) {
//       errors.push(
//         createError(
//           'body',
//           '009: field title must be at least 3 character but not more than 30 characters.',
//           'title'
//         )
//       )
//     }
//   }

//   if (errors.length > 0) {
//     blue('errors', errors)
//     res.status(422).json({
//       errors
//     })
//   } else {
//     next()
//   }
// }

// export default validation
