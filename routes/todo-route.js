import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from '../db'
// import validateType from 'validation'
import { yellow, red } from 'logger'
import { isValidMongoStringId } from 'lib'

const router = express.Router()

// const todoType = {
//   title: {
//     type: ['number', 'string'],
//     minLength: 3,
//     required: true
//   },
//   completed: {
//     type: ['boolean'],
//     required: false
//   }
// }

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
  // yellow('formatReturnSuccess**')
  return { data: data, error: null }
}

const formatReturnError = error => {
  // yellow('error', error instanceof Error ? 'yes' : 'no')
  // yellow('error.message', error.message)
  return { data: null, error: error.message }
}

/*
    - assumes only { title: string } is sent
    - { completed: false } will be added to all new todos
 */
router.post('/', async (req, res) => {
  try {
    const td1 = req.body
    // const validation = validateType(td1, todoType)
    // yellow('validation', validation)
    // if (validation.errorCount > 0) {
    //   // res.status(400).send({ data: null, error: validation })

    //   res.status(400).send(formatReturnError(new Error(validation)))
    // } else {
    //   const td2 = {
    //     title: td1.title,
    //     completed: false
    //   }
    //   const inserted = await insertOne('todos', td2)
    //   res.send(inserted)
    // }
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

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    if (!isValidMongoStringId(id)) {
      const err = formatReturnError(
        new Error(`Error: ${id} is not a valid MongoDB _id`)
      )
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
