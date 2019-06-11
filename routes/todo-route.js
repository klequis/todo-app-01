import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate,
  objectIdFromHexString
} from '../db'
import validateType from 'validation'
import { yellow } from 'logger'
import { hasProp } from '../lib/hasProp';

const router = express.Router()

const todoType = {
  title: {
    type: ['number', 'string'],
    minLength: 3,
    required: true,
  },
  completed: {
    type: ['boolean'],
    required: false,
  }
}

/*
    - assumes only { title: string } is sent
    - { completed: false } will be added to all new todos
 */
router.post('/', async (req, res) => {
  try {
    const td1 = req.body
    const validation = validateType(td1, todoType)
    
    if (validation.errorCount > 0) {
      // yellow('validation', validation)
      // yellow('RETURN ERROR')
      res.status(400).send({ data: null, error: validation })
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

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    let todo = await findOneAndDelete('todos', id)
    if (!todo) {
      return res.status(404).send()
    }
    res.send(todo)
  } catch (e) {
    res.status(400).send()
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
