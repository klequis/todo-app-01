import wrap from 'routes/wrap'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { findOneAndUpdate } from 'db'
import { validationResult } from 'express-validator'
import { mergeRight, pick } from 'ramda'
import {
  mongoIdInBodyCheck,
  mongoIdInParamsCheck,
  completedCheck,
  createdAtCheck,
  dueDateCheck,
  titleLengthCheck,
  userIdInBodyCheck,
  userIdInParamsCheck,
  lastUpdatedAtCheck
} from './validationChecks'

import { green, red } from 'logger'

// green('t1', t1)
// green('_id isMongo', isMongoId(t1._id))
// green('title is > 2', t1.title.length > 2)
// // green('userId', isAuth0UserId(t1.userId))
// green('userId', t1.userId)
// green('completed', t1.completed)
// green('createdAT', t1.createdAt)

/**
 * @param {object} todo a complete todo { _id, title, completed }
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo, the modified todo
 */

const todoPatch = wrap(async (req, res) => {
  red('_id in todo MUST = userid in params')
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    green('todoPatch errors', errors.array())
    return res.status(422).json({ errors: errors.array() })
  }

  const { body, params } = req
  
  // const _id = params.id
  const { userid } = params
  const { _id } = body


  // filter incoming fields
  const t1 = pick([
    'completed',
    'dueDate',
    'lastUpdatedAt',
    'title',
  ], body)
  const t2 = mergeRight(t1, { lastUpdatedAt: new Date().toISOString() })

  const r = await findOneAndUpdate(TODO_COLLECTION_NAME, { _id, userId: userid }, t2)
  green('r', r)
  res.send(r)
})

export default todoPatch

export const patchValidationSchema = {
  todoid: mongoIdInParamsCheck,
  _id: mongoIdInBodyCheck,

  completed: completedCheck,
  createdAt: createdAtCheck,
  dueDate: dueDateCheck,
  lastUpdatedAt: lastUpdatedAtCheck,
  title: titleLengthCheck,
  userId: userIdInBodyCheck,
  userid: userIdInParamsCheck
}
