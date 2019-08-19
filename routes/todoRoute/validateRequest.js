import { blue } from 'logger'
import { isBoolean, isISO8601, isMongoId } from 'validator'
import { map, mergeRight } from 'ramda'

const createError = rule => {
  const { field, location, expectedType, value, errorMessage } = rule
  return {
    field: field,
    location: location,
    expected: expectedType,
    received: typeof value,
    value: value,
    errorMessage: errorMessage
  }
}

const validateRequest = schema => {
  return (req, res, next) => {
    blue('** hi **', schema)
    const { body, params } = req
    blue('body', body)
    blue('params', params)
    const errors = []
    for (let i = 0; i < schema.length; i++) {
      const { field, location, expectedType, value, errorMessage } = schema[i]
      let err = {}
      const { _id } = params
      switch (expectedType) {
        case 'boolean':
          if (!isBoolean(value)) {
            err = createError(schema[i])
          }
          break
        case 'date':
          if (!isISO8601(value)) {
            err = createError(schema[i])
          }
          break
        case 'mongoId':
          if (!isMongoId(value)) {
            err = createError(schema[i])
          }
      }
      errors.push(err)
    }
    blue('body', typeof body)
    const newBody = mergeRight(body, { errors })
    req.body = newBody

    blue('req.body', req.body)
    next()
  }
}

export default validateRequest