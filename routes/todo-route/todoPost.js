import express from 'express'
import wrap from 'routes/wrap'
import { validationResult, checkSchema } from 'express-validator'

const router = express.Router()

const parseAuth0UserId = userId => {
  const a = userId.split('|')
  return a[1]
}

const isHexString = hexId => {
  const checkForHexString = new RegExp('^[0-9a-fA-F]{24}$')
  if (!hexId) {
    return false
  }
  return checkForHexString.test(hexId)
}

export const checkAuth0UserId = userId => {
  // e.g., "auth0|5d1c...7"
  const id = parseAuth0UserId(userId)
  return isHexString(id)
}

export const userExists = async userId => {
  const r = await find(collectionName, {
    userId: userId
  })

  const exists = r.length > 0 ? true : false
  return exists
}

/**
 *
 * @description filter out any undesired fields
 * @description userId is aka 'sub' in data returned from Auth0
 *
 * @param {object} todo {
    'dueDate',  (optional)
    'title', 
    'userId', 
 * }
 *
 * @returns {object} a todo {
 *  _id,
 * completed,
 * createdAt,
 * dueDate, (if passed in will be set, otherwise null)
 * lastUpdatedAt,
 * title 
 * userId,
 * }
 *
 */
export const postValidationSchema = {
  dueDate: {
    in: ['body'],
    custom: {
      errorMessage: 'Due date is not a valid date',
      options: value => {
        yellow('date value', value)
        return isValid(new Date(value))
      }
    }
  },
  title: {
    in: ['body'],
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  },
  userId: {
    custom: {
      errorMessage: 'Unknown user',
      options: async value => {
        const chkId = checkAuth0UserId(value)
        if (!chkId) {
          throw 'userId is not valid.'
        }
        const exists = await userExists(value)
        if (!exists) {
          throw 'User not found.'
        }
      }
    }
  }
}


/**
 * @param {string} title the title of the todo
 * @param {string} email a valid email address
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo
 */
const post = router.post(
  '/',
  checkSchema(postValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
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

    const inserted = await insertOne(collectionName, td2)
    res.send(inserted)
  })
)

export default post
