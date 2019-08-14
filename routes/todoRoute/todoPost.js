import wrap from 'routes/wrap'
import { validationResult } from 'express-validator'
import { insertOne } from 'db'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { isValidDate, isValidAuth0UserId } from 'lib'

import { green } from 'logger'

/**
 * @param {string} title the title of the todo
 * @param {string} userId
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo
 */
const todoPost = wrap(async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { body } = req

  const { dueDate, title, userId } = body

  const td1 = {
    completed: false,
    createdAt: new Date(),
    dueDate: dueDate || null,
    lastUpdatedAt: new Date(),
    title: title,
    userId: userId,
  }

  const inserted = await insertOne(TODO_COLLECTION_NAME, td1)
  res.send(inserted)
})

export default todoPost

export const postValidationSchema = {
  title: {
    in: ['body'],
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  },
  dueDate: {
    in: ['body'],
    custom: {
      errorMessage: 'Due date is not a valid date.',
      options: value => isValidDate(value, true)
    }
  },
  userId: {
    custom: {
      errorMessage: 'Unknown user.',
      options: value => isValidAuth0UserId(value)
    }
  }
}
