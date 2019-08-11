import express from 'express'
const router = express.Router()
import wrap from 'routes/wrap'

/**
 * @param {object} todo a complete todo { _id, title, completed }
 *
 * @returns {object} [{ _id, title, completed }] an array of one todo, the modified todo
 */

const patchValidationSchema = {
  id: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Parameter id must be a valid MongodDB hex string.'
    }
  },
  title: {}
}

const patch = router.patch(
  '/',
  wrap(async (req, res) => {
    const t1 = req.body
    const t2 = filterFields(t1)
    const { _id } = t2
    const t3 = removeIdProp(t2)
    const r = await findOneAndUpdate(collectionName, _id, t3)
    res.send(r)
  })
)

export default patch