import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from '../db'
import { check, validationResult, checkSchema } from 'express-validator'
import { redf, yellow } from '../logger'
import { removeIdProp } from '../db/helpers'
import wrap from '../wrap'


const router = express.Router()

const postValidationSchema = {
  title: {
    in: ['body'],
    isString: {
      errorMessage: 'Title must be a string.'
    },

    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  }
}

router.post(
  '/',
  checkSchema(postValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const td1 = req.body
    const td2 = {
      title: td1.title,
      completed: false
    }
    const inserted = await insertOne('todos', td2)
    res.send(inserted)
  })
)

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
 * @param {string} id A valid MongoDB _id
 *
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

router.patch(
  '/',
  wrap(async (req, res) => {
    const t1 = req.body
    const id = t1._id
    const t2 = removeIdProp(t1)
    const u = await findOneAndUpdate('todos', id, t2)
    res.send(u)
  })
)

export default router
