import express from 'express'
import wrap from 'routes/wrap'

const router = express.Router()

/**
 * @returns {object} [{ _id, title, completed }] and array of all todos
 */
export const get = router.get(
  '',
  wrap(async (req, res, next) => {
    const td1 = await find(collectionName)
    res.send(td1)
  })
)

export default get