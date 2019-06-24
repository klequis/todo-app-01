import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from '../db'
import { check, validationResult } from 'express-validator/check'
import { green, red } from 'logger'

const router = express.Router()

const ex = () => {
  var array = [1, 2, 3, 4, 5]

  var even = function(element) {
    // checks whether an element is even
    return element % 2 === 0
  }

  console.log(array.some(even))
}



const getError = errMsg => {
  const err500 = [
    'failed to reconnect',
    'failed to connect to server',
    'MongoNetworkError',
    'ECONNREFUSED',
    'Unable to connect to MongoDB'
  ]

  const includes = str => errMsg.includes(str)

  if (err500.some(includes)) {
    return {
      status: 500,
      type: 'Internal server error',
      message: 'Internal server error.',
      errors: []
    }
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
    // check('username').isLength(3)
  ],
  async (req, res) => {
    try {
      green('body', req.body)
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
      console.error('error', e)
      res.status(400).send(e)
    }
  }
)

router.get('/', async (req, res) => {
  // green('get ****')
  // green('req', req)
  try {
    const todos = await find('todos')
    res.send(todos)
  } catch (e) {
    const err = getError(e.message)
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
    green('delete: id', id)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      let todo = await findOneAndDelete('todos', id)
      // green('todo', todo)

      if (!todo) {
        return res.status(400).send()
      }
      res.send(todo)
    } catch (e) {
      // green('router.delete.catch: e', e.message)
      res.status(400).send(e.message)
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
    // green('get/:id ****')
    // const id = req.params.id
    // green('id', id)
    try {
      const errors = validationResult(req)
      // green('errors', errors)
      if (!errors.isEmpty()) {
        green('isEmpty', errors.isEmpty())
        green('errors.array()', errors.array())
        return res.status(422).json({ errors: errors.array() })
      }
      green('did not return **')
      
      const todos = await findById('todos', id)
      res.send(todos)
    } catch (e) {
      green('catch **')
      const err = getError(e.message)
      // res.status(err.status).send('be this does not show')
      res.status(err.status).send()
    }
  }
)

router.patch('/', async (req, res) => {
  try {
    const todo = req.body
    green('todo', todo)
    const u = await findOneAndUpdate('todos', todo._id, todo)
    res.send(u)
  } catch (e) {
    res.status(400).send(e)
  }
})

export default router
