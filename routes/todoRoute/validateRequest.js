import { blue } from 'logger'
import { isBoolean, isISO8601, isMongoId } from 'validator'
import { map, mergeRight, pick } from 'ramda'

const createError = (rule, value) => {
  blue('*************** value', value)
  const { field, location, expectedType, errorMessage } = rule
  return {
    field: field,
    location: location,
    expected: expectedType,
    received: typeof value,
    value: value,
    errorMessage: errorMessage
  }
}

const getValueFromParams = (field, params) => {
  blue('findInParams', { field, params })
  const r = pick([field], params)

  return r[field] || undefined
}

const getValueFromBody = (field, body) => {
  blue('findInBody', { field, body })
  const r = pick([field], body)

  return r[field] || undefined
}

const validateRequest = schema => {
  return (req, res, next) => {
    const { body, params } = req
    // blue('params', params)
    const errors = []

    for (let i = 0; i < schema.length; i++) {
      const { field, location, expectedType, value, errorMessage } = schema[i]
      let err = {}
      const { _id } = params
      blue('location', location)
      const valueToCheck =
        location === 'params'
          ? getValueFromParams(field, params)
          : getValueFromBody(field, body)

      blue('valueToCheck', valueToCheck)
      if (valueToCheck === undefined) {
        err = createError(schema[i], valueToCheck)
      } else {
        switch (expectedType) {
          case 'boolean':
            if (!isBoolean(valueToCheck)) {
              err = createError(schema[i], valueToCheck)
            }
            break
          case 'date':
            if (!isISO8601(valueToCheck)) {
              err = createError(schema[i], valueToCheck)
            }
            break
          case 'mongoId':
            if (!isMongoId(valueToCheck)) {
              err = createError(schema[i], valueToCheck)
            }
        }
      }
      errors.push(err)
    }
    // blue('body', typeof body)
    // const newBody = mergeRight(body, { errors })
    // req.body = newBody

    // blue('req.body', req.body)
    if (errors.length > 0) {
     return res.status(422).json({ errors })
    } else {
      next()
    }
  }
}

export default validateRequest
