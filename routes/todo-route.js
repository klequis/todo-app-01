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
import { isValidMongoStringId } from 'lib'

const router = express.Router()

const todoType = {
  name: 'todoType',
  fields: [
    {
      name: 'title',
      dataTypes: ['number', 'string'],
      minLength: 3,
      required: true
    },
    {
      name: 'completed',
      dataTypes: ['boolean'],
      required: false
    }
  ]
}

const formatReturnSuccess = data => {
  return { data: data, error: null }
}

const formatReturnError = error => {
  return { data: null, error: error.message }
}

/*
    - only intended to be used for new todos
    - assumes only { title: string } is sent
    - { completed: false } will be added to all new todos
 */
router.post('/',
[
  check('title').isString().withMessage('Title must be a string.'),
  check('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long.')
  // check('username').isLength(3)
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
    console.error('error', e)
    res.status(400).send(e)
  }
})

router.delete('/:id', 
[
  check('id').isMongoId().withMessage('Parameter id must be a valid MongodDB hex string.')
],
async (req, res) => {
  const id = req.params.id
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
})

router.get('/', async (req, res) => {
  green('get ****')
  try {
    const todos = await find('todos')
    res.send(todos)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todos = await findById('todos', id)
    res.send(todos)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const u = await findOneAndUpdate('todos', id, req.body)
    res.send(u)
  } catch (e) {
    res.status(400).send(e)
  }
})

export default router
