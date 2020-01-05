import wrap from 'routes/wrap'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { findOneAndUpdate } from 'db'
import { mergeRight, pick } from 'ramda'
import { yellow, red } from 'logger'

/**
 * @param {object} todo a complete todo { _id, completed, title }
 *
 * @returns {object} [{ _id, completed, title }] an array of one todo, the modified todo
 */

const todoPatch = wrap(async (req, res) => {
  red('_id in todo MUST = userid in params')

  const { body, params } = req
  const { userid } = params
  const { _id } = body
  yellow('body', body)
  yellow('params', params)

  const t1 = pick(['completed', 'dueDate', 'lastUpdatedAt', 'title'], body)
  const t2 = mergeRight(t1, { lastUpdatedAt: new Date().toISOString() })

  const r = await findOneAndUpdate(
    TODO_COLLECTION_NAME,
    { _id, userId: userid },
    t2
  )
  yellow('r', r)

  res.send(r)
})

export default todoPatch
