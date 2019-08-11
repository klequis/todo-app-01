import wrap from 'routes/wrap'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { findOneAndUpdate } from 'db'

/**
 * @param {object} todo a complete todo { _id, title, completed }
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo, the modified todo
 */

const todoPatch = router.patch(
  '/',
  wrap(async (req, res) => {
    const t1 = req.body
    const t2 = filterFields(t1)
    const { _id } = t2
    const t3 = removeIdProp(t2)
    const r = await findOneAndUpdate(TODO_COLLECTION_NAME, _id, t3)
    res.send(r)
  })
)

export default todoPatch

export const patchValidationSchema = {
  id: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  },
  title: {
    in: ['body'],
    isLength: {
      errorMessage: 'Title must be at least 3 characters long.',
      options: { min: 3 }
    }
  }
}
