import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from '../db'
import { check, validationResult, checkSchema } from 'express-validator'
import { yellow, red } from '../logger'
import { removeIdProp } from '../db/helpers'
import debug from 'debug'
import wrap from '../wrap'

const lTodoRoute = (debug)('todo-route')

const router = express.Router()

const getError = error => {
  yellow('getError: error', error.message)
  if (process.env.NODE_ENV !== 'production') {
    red('todo-route ERROR:', error.message)
  }
  // const msg = err.message
  
  if (error.message.includes('No document found')) {
    return {
      status: 404,
      type: 'Bad request',
      message: 'Resource not found',
      errors: []
    }
  }
  return {
    status: 500,
    type: 'Internal server error',
    message: 'Internal server error.',
    errors: []
  }
}

const postValidationSchema = {
  title: {
    in: ['body'],
    isString: {
      errorMessage: 'Title must be a string.',  
    },
    
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  }
}

// const postValidator = [
//     check('title')
//       .isString()
//       .withMessage('Title must be a string.'),
//     check('title')
//       .isLength({ min: 3 })
//       .withMessage('Title must be at least 3 characters long.')
//   ]

router.post('/',
  checkSchema(postValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }
    const td1 = req.body
    const td2 = {
      title: td1.title,
      completed: false
    }
    const inserted = await insertOne('todos', td2)
    res.send(inserted)
  }
))

// Original
// 
// router.post(
//   '/',
//   [
//     check('title')
//       .isString()
//       .withMessage('Title must be a string.'),
//     check('title')
//       .isLength({ min: 3 })
//       .withMessage('Title must be at least 3 characters long.')
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() })
//       }
//       const td1 = req.body
//       const td2 = {
//         title: td1.title,
//         completed: false
//       }
//       const inserted = await insertOne('todos', td2)
//       res.send(inserted)
//     } catch (e) {
//       const err = getError(e)
//       res.status(err.status).send(err)
//     }
//   }
// )


router.get('', wrap(async (req, res, next) => {
  const td1 = await find('todos')
  res.send(td1)
}))

// router.get('/', async (req, res) => {
//   lTodoRoute('hi from GET')
//   t => ry {
//     const td1 = await find('todos')
//     res.send(td1)
//   } catch (e) {
//     const err = getError(e)
//     res.status(err.status).send(err)
//   }
// })


const deleteValidationSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    },
  }
}


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
      const id = req.params.id
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