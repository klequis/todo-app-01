import wrap from 'routes/wrap'
import { findOneAndDelete } from 'db'
import { TODO_COLLECTION_NAME } from 'routes/constants'



/**
 * @param {string} userid 
 * @param {string} _id A valid MongoDB object id
  *
 * @returns {object} the deleted todo
 */

 // delete is a key word in JS so use 'del'
const todoDelete = wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const id = req.params.id
    const td1 = await findOneAndDelete(TODO_COLLECTION_NAME, id)
    res.send(td1)
  })

export const deleteValidationSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  }
}

export default todoDelete

