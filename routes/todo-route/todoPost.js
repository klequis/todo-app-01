import wrap from 'routes/wrap'
import { validationResult } from 'express-validator'
import { filterFields } from './todoHelpers'
import { insertOne } from 'db'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { isValidDate, isValidAuth0UserId } from 'lib'
import { find } from 'db'
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
    // green('todoPost errors', errors.array())
    return res.status(422).json({ errors: errors.array() })
  }
  const td1 = filterFields(req.body)

  const { dueDate, title, userId } = td1

  const td2 = {
    createdAt: new Date(),
    dueDate: dueDate || null,
    lastUpdated: new Date(),
    userId: userId,
    title: title,
    completed: false
  }

  const inserted = await insertOne(TODO_COLLECTION_NAME, td2)
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
      errorMessage: 'Due date is not a valid date',
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
