import express from 'express'
import wrap from 'routes/wrap'
import { validationResult, checkSchema } from 'express-validator'


const router = express.Router()

const getByIdValidationSchema = {
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  }
}

/**
 * @param {string} _id a valid MongoDB object id
 *
 * @return {object} 1 todo
 */
const getById = router.get(
  '/:id',
  checkSchema(getByIdValidationSchema),
  wrap(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const id = req.params.id
    const td1 = await findById(collectionName, id)
    res.send(td1)
  })
)

export default getById