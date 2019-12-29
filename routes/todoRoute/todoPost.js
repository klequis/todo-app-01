import wrap from 'routes/wrap'
import { insertOne } from 'db'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { green, logRequest } from 'logger'

/**
 * @param {string} title the title of the todo
 * @param {string} userId
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo
 */
const todoPost = wrap(async (req, res) => {
  const { body, params } = req
  const { dueDate, title } = body

  const { userid } = params

  const td1 = {
    completed: false,
    createdAt: new Date(),
    dueDate: dueDate || null,
    lastUpdatedAt: new Date(),
    title: title,
    userId: userid
  }

  const inserted = await insertOne(TODO_COLLECTION_NAME, td1)
  green('POST inserted', inserted)
  res.send(inserted)
})

export default todoPost
