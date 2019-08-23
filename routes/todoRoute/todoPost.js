import wrap from 'routes/wrap'
import { insertOne } from 'db'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { green, logRequest } from 'logger'

/**
 * @param {string} title the title of the todo
 * @param {string} userId
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo
 */
const todoPost = wrap(async (req, res) => {
  green('**POST')
  logRequest(req)

  const { body, params } = req

  const { dueDate, title } = body

  // green('POST params', params)
  const { userid } = params
  // green('POST userid', userid)

  const td1 = {
    completed: false,
    createdAt: new Date(),
    dueDate: dueDate || null,
    lastUpdatedAt: new Date(),
    title: title,
    userId: userid
  }

  const inserted = await insertOne(TODO_COLLECTION_NAME, td1)
  // green('POST inserted', inserted)
  res.send(inserted)
})

export default todoPost