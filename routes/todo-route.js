import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from '../db'
import { check, validationResult } from 'express-validator'
import { green, red } from 'logger'
import { removeIdProp } from 'db/helpers'

const router = express.Router()

const getError = error => {
  if (process.env.NODE_ENV !== 'production') {
    red('todo-route ERROR:', error.message)
  }
  if (error.message.includes('No document found')) {
    return {
      status: 400,
      type: 'Bad request',
      message: '_id not found',
      errors: []
    }
  }
  // const includes = str => errMsg.includes(str)

  return {
    status: 500,
    type: 'Internal server error',
    message: 'Internal server error.',
    errors: []
  }
}


/*
    - only intended to be used for new todos
    - assumes only { title: string } is sent
    - { completed: false } will be added to all new todos
 */
router.post(
  '/',
  [
    check('title')
      .isString()
      .withMessage('Title must be a string.'),
    check('title')
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters long.')
  ],
  async (req, res) => {
    try {
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
    } catch (e) {
      const err = getError(e)
      res.status(err.status).send(err)
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const td1 = await find('todos')
    res.send(td1)
  } catch (e) {
    const err = getError(e)
    res.status(err.status).send(err)
  }
})

/**
 * @param {string} id A valid MongoDB _id
 * 
 */

router.delete(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('Parameter id must be a valid MongodDB hex string.')
  ],
  async (req, res) => {
    const id = req.params.id
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      let td1 = await findOneAndDelete('todos', id)
      if (!td1) {
        return res.status(400).send()
      }
      res.send(td1)
    } catch (e) {
      const err = getError(e)
      res.status(err.status).send(err)
    }
  }
)

router.get(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('Parameter id must be a valid MongodDB hex string.')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        green('isEmpty', errors.isEmpty())
        green('errors.array()', errors.array())
        return res.status(422).json({ errors: errors.array() })
      }
      const id = req.body.id
      const td1 = await findById('todos', id)
      res.send(td1)
    } catch (e) {
      const err = getError(e)
      res.status(err.status).send(err)
    }
  }
)

router.patch('/', async (req, res) => {
  try {
    const t1 = req.body
    const id = t1._id
    const t2 = removeIdProp(t1)
    const u = await findOneAndUpdate('todos', id, t2)
    res.send(u)
  } catch (e) {
    const err = getError(e)
    res.status(err.status).send(err)
  }
})

export default router


// const getError = error => {
//   if (process.env.NODE_ENV !== 'production') {
//     red('todo-route ERROR:', error)
//   }
//   const err500 = [
//     'failed to reconnect',
//     'failed to connect to server',
//     'MongoNetworkError',
//     'ECONNREFUSED',
//     'Unable to connect to MongoDB'
//   ]

//   const includes = str => errMsg.includes(str)

//   if (err500.some(includes)) {
//   return {
//     status: 500,
//     type: 'Internal server error',
//     message: 'Internal server error.',
//     errors: []
//   }
//   } else {

//   }
// }