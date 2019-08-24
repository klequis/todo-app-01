import wrap from 'routes/wrap'
import { findOneAndDelete } from 'db'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { logRequest } from 'logger'

/**
 * @param {string} userid
 * @param {string} _id A valid MongoDB object id
 *
 * @returns {object} the deleted todo
 */

// delete is a key word in JS so use 'del'


// Although Mongo _id is uniquie, requiring the userid to delete a todo is more secure
// Validation checks that the userid is sent and that it is a valid UUID
// but it dosen't check if the user is in the db so effectively do that here.
const todoDelete = wrap(async (req, res) => {
  logRequest(req)
  const { params } = req
  const { userid: userId, todoid: _id } = params
  const td1 = await findOneAndDelete(TODO_COLLECTION_NAME, { _id, userId})
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
