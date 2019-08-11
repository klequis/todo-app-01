import wrap from 'routes/wrap'
import { find } from 'db'
import { TODO_COLLECTION_NAME } from 'routes/constants'


/**
 * @returns {object} [{ _id, title, completed }] and array of all todos
 */
const todoGet = wrap(async (req, res, next) => {
  const td1 = await find(TODO_COLLECTION_NAME)
  res.send(td1)
})

export default todoGet
