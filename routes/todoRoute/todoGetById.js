import wrap from 'routes/wrap'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { findById } from 'db'


/**
 * @param {string} _id a valid MongoDB object id
 *
 * @return {object} 1 todo
 */
const todoGetById = wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const id = req.params.id
    const td1 = await findById(TODO_COLLECTION_NAME, id)
    res.send(td1)
  })

export default todoGetById

export const getByIdValidationSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  }
}