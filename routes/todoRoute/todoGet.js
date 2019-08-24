import wrap from 'routes/wrap'
import { find } from 'db'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { green, logRequest } from 'logger'

/**
 * @returns {object} [{ _id, title, completed }] and array of all todos
 */
const todoGet = wrap(async (req, res, next) => {
  logRequest('req')
  const { params } = req
  green('params', params)
  // const { id: _id } = req.params

  const td1 = await find(TODO_COLLECTION_NAME, { userid })
  res.send(td1)
})

export default todoGet
