import wrap from 'routes/wrap'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { find } from 'db'
import { green } from 'logger'

/**
 * @param {string} _id a valid MongoDB object id
 *
 * @return {object} 1 todo
 */
const todoGetById = wrap(async (req, res) => {
  const { params } = req
  const  { userid: userId, todoId: _id } = params
  green('params', params)
  const id = params.id
  const td1 = await find(TODO_COLLECTION_NAME, { userId, _id })
  res.send(td1)
})

export default todoGetById
