import express from 'express'
import wrap from 'routes/wrap'
import { validationResult, checkSchema } from 'express-validator'

const router = express.Router()

const deleteValidationSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  }
}

/**
 * @param {string} _id A valid MongoDB object id
 *
 * @returns {object} the deleted todo
 */

 // delete is a key word in JS so use 'del'
const del = router.delete(
  '/:id',
  checkSchema(deleteValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const id = req.params.id
    const td1 = await findOneAndDelete(collectionName, id)
    res.send(td1)
  })
)

export default del