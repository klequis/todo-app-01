import wrap from 'routes/wrap'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { findOneAndUpdate } from 'db'
import { validationResult } from 'express-validator'
import { green } from 'logger'
import { isMongoId } from 'validator'
import { isAuth0UserId } from 'lib'
import { filterFields } from './todoHelpers'
import { removeIdProp } from 'lib'
import { mergeRight } from 'ramda'

/**
 * @param {object} todo a complete todo { _id, title, completed }
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo, the modified todo
 */

const todoPatch = wrap(async (req, res) => {
  const errors = validationResult(req)
  // green('errors', errors)

  // if (!errors.isEmpty()) {
  //   green('todoPatch errors', errors.array())
  //   return res.status(422).json({ errors: errors.array() })
  // }

  // 1. update all fields received
  // 2. update modifiedAt

  const t1 = req.body
  green('t1', t1)
  green('_id isMongo', isMongoId(t1._id))
  green('title is > 2', t1.title.length > 2)
  // green('userId', isAuth0UserId(t1.userId))
  green('userId', t1.userId)
  green('completed', t1.completed)
  green('createdAT', t1.createdAt)


  
  const t2 = filterFields(t1)

  const { _id } = t2
  const t3 = removeIdProp(t2)
  const t4 = mergeRight(t3, { lastUpdatedAt: new Date().toISOString() })
  green('t4', t4)
  const r = await findOneAndUpdate(TODO_COLLECTION_NAME, _id, t4)
  res.send(r)
})

export default todoPatch

export const patchValidationSchema = {
  id: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  },
  title: {
    in: ['body'],
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  }
}
