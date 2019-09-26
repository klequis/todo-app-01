import wrap from 'routes/wrap'
import { insertOne } from 'db'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { green, logRequest } from 'logger'
import { escape } from 'validator'

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
    title: escape(title),
    userId: userid
  }
  // const json = JSON.stringify(td1)
  // green('escape', escape(json))
  const inserted = await insertOne(TODO_COLLECTION_NAME, td1)
  // green('POST inserted', escape(inserted.toString()))
  res.send(inserted)
})

export default todoPost

