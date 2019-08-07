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

/**
 * 
 * @description filter out any undesired fields
 * 
 * @param {object} todo 
 * 
 * @returns {object} a todo { _id, title, completed }
 */
const filterFields = todo => {
  return pick(['email', '_id', 'title', 'completed'], todo)
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
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Invalid or missing email.'
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

    const inserted = await insertOne('todos', td2)
    res.send(inserted)
  })
)

/**
 * @returns {object} [{ _id, title, completed }] and array of all todos
 */
router.get(
  '',
  wrap(async (req, res, next) => {
    const td1 = await find('todos')
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
    const td1 = await findOneAndDelete('todos', id)
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
    const td1 = await findById('todos', id)
    res.send(td1)
  })
)

/**
 * @param {object} todo a complete todo { _id, title, completed }
 * 
 * @returns {object} [{ _id, title, completed }] an array of one todo
 */

router.patch(
  '/',
  wrap(async (req, res) => {
    const t1 = req.body
    const t2 = filterFields(t1)
    const { _id } = t2
    const t3 = removeIdProp(t2)
    const r = await findOneAndUpdate('todos', _id, t3)
    res.send(r)
  })
)

export default router
