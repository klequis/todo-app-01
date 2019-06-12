import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from '../db'
import validateType from 'validation'
import { yellow, red } from 'logger'
import { isValidMongoStringId } from 'lib'

const router = express.Router()

const todoType = {
  title: {
    type: ['number', 'string'],
    minLength: 3,
    required: true
  },
  completed: {
    type: ['boolean'],
    required: false
  }
}

const formatReturnSuccess = data => {
  yellow('formatReturnSuccess**')
  return { data: data, error: null }
}

const formatReturnError = error => {
  // yellow('msg', error.message)
  const msg = error.message

  return { data: null, error: error.message }
}

//////////////////////////////////////////////////////

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  yellow('typeof id', id)
  try {
    
    if (!isValidMongoStringId(id)) {
      const err = formatReturnError(new Error(`Error: ${id} is not a valid MongoDB _id`))
      res.status(400).send(err)
    }
    
    let todo = await findOneAndDelete('todos', id)
    if (!todo) {
      return res.status(400).send()
    }
    res.send(todo)
  } catch (e) {
    res.status(400).send()
  }
})

/////////////////////////////////////////////////////////////

/*
    - assumes only { title: string } is sent
    - { completed: false } will be added to all new todos
 */
router.post('/', async (req, res) => {
  try {
    const td1 = req.body
    const validation = validateType(td1, todoType)

    if (validation.errorCount > 0) {
      // res.status(400).send({ data: null, error: validation })

      res.status(400).send(formatReturnError(validation))
    } else {
      const td2 = {
        title: td1.title,
        completed: false
      }
      const inserted = await insertOne('todos', td2)
      res.send(inserted)
    }
  } catch (e) {
    console.error('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
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
