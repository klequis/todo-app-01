import wrap from 'routes/wrap'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { findOneAndUpdate } from 'db'
import { mergeRight, pick } from 'ramda'
import { green, red } from 'logger'


/**
 * @param {object} todo a complete todo { _id, title, completed }
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo, the modified todo
 */

const todoPatch = wrap(async (req, res) => {
  red('_id in todo MUST = userid in params')

  const { body, params } = req
  
  // const _id = params.id
  const { userid } = params
  const { _id } = body

  // filter incoming fields
  const t1 = pick([
    'completed',
    'dueDate',
    'lastUpdatedAt',
    'title',
  ], body)
  const t2 = mergeRight(t1, { lastUpdatedAt: new Date().toISOString() })

  const r = await findOneAndUpdate(TODO_COLLECTION_NAME, { _id, userId: userid }, t2)
  res.send(r)
})

export default todoPatch

