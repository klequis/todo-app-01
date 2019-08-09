import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from '../db'
import { validationResult, checkSchema } from 'express-validator'
import { removeIdProp } from '../db/helpers'
import wrap from '../wrap'
import { pick } from 'ramda'

import { yellow } from 'logger'

const collectionName = 'todos'

/**
 *
 * @description filter out any undesired fields
 * @description user_id is aka 'sub' in date returned from Auth0
 *
 * @param {object} todo { user_id, title }
 *
 * @returns {object} a todo { _id, user_id, completed, title }
 *
 */
const filterFields = todo => {
  return pick(['email', '_id', 'title', 'completed'], todo)
}

const parseAuth0UserId = userId => {
  const a = userId.split('|')
  return a[1]
}

const isHexString = hexId => {
  const checkForHexString = new RegExp('^[0-9a-fA-F]{24}$')
  if (!hexId) {
    return false
  }
  return checkForHexString.test(hexId)
}

const checkAuth0UserId = userId => {
  // e.g., "auth0|5d1c...7"
  const id = parseAuth0UserId(userId)
  return isHexString(id)
}

const userExists = async userId => {
  const r = await find(collectionName, {
    userId: userId
  })

  const exists = r.length > 0 ? true : false
  yellow('userExists: exists', exists)
  return exists
}

const router = express.Router()

const postValidationSchema = {
  title: {
    in: ['body'],
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  },
  userId: {
    custom: {
      errorMessage: 'Unknown user',
      options: async (value, { req, location, path }) => {

        const chkId = checkAuth0UserId(value)
        if (!chkId) {
          throw 'userId is not valid.'
        }
        const exists = await userExists(value)
        if (!exists) {
          throw 'User not found.'
        }

        // TODO: Show this logging in the book
        // yellow(
        //   'options',
        //   `value: ${value}, location: ${location}, path: ${path}`
        // )
        // yellow('value', value)
      }
    }
  }
}

/**
 * @param {string} title the title of the todo
 * @param {string} email a valid email address
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo
 */
router.post(
  '/',
  checkSchema(postValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const td1 = req.body
    // const td2 = filterFields(td1)

    const { email, title } = td1

    const td2 = {
      email: email,
      title: title,
      completed: false
    }

    const inserted = await insertOne(collectionName, td2)
    res.send(inserted)
  })
)

/**
 * @returns {object} [{ _id, title, completed }] and array of all todos
 */
router.get(
  '',
  wrap(async (req, res, next) => {
    const td1 = await find(collectionName)
    res.send(td1)
  })
)

const deleteValidationSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  }
}

/**
 * @param {string} _id A valid MongoDB object id
 *
 * @returns {object} the deleted todo
 */

router.delete(
  '/:id',
  checkSchema(deleteValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const id = req.params.id
    const td1 = await findOneAndDelete(collectionName, id)
    res.send(td1)
  })
)

const getByIdValidationSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  }
}

/**
 * @param {string} _id a valid MongoDB object id
 *
 * @return {object} 1 todo
 */
router.get(
  '/:id',
  checkSchema(getByIdValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const id = req.params.id
    const td1 = await findById(collectionName, id)
    res.send(td1)
  })
)

/**
 * @param {object} todo a complete todo { _id, title, completed }
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo, the modified todo
 */

const patchValidationSchema = {
  id: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  },
  title: {}
}

router.patch(
  '/',
  wrap(async (req, res) => {
    const t1 = req.body
    const t2 = filterFields(t1)
    const { _id } = t2
    const t3 = removeIdProp(t2)
    const r = await findOneAndUpdate(collectionName, _id, t3)
    res.send(r)
  })
)

export default router
