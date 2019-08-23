import {
  // isBoolean,
  isEmpty,
  isISO8601,
  isLength,
  isMongoId,
  isUUID
} from 'validator'
import { toString } from 'lib'
import createError from './createError'

const todoPostValidation = (req, res, next) => {
  const errors = []

  const { params } = req
  const { userid, todoid } = params

  if (!isUUID(toString(userid), 4))
    errors.push(createError('params', 'param userid is not valid', 'userid'))
  if (!isMongoId(toString(todoid)))
    errors.push(
      createError('params', 'param todoid is not valid', 'todoid', 'todoid')
    )

  next()
}

export default todoPostValidation
