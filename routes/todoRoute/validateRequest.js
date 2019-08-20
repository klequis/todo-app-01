import { blue } from 'logger'
import { isBoolean, isISO8601, isMongoId } from 'validator'
import { map, mergeRight, pick } from 'ramda'

const toString = (value, deep = true) => {
  if (Array.isArray(value) && value.length && deep) {
    return toString(value[0], false)
  } else if (value instanceof Date) {
    return value.toISOString()
  } else if (value && typeof value === 'object' && value.toString) {
    return value.toString()
  } else if (value == null || (isNaN(value) && !value.length)) {
    return ''
  }

  return String(value)
}

const createError = (rule, value) => {
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
  // blue('findInParams', { field, params })
  const r = pick([field], params)

  return r[field] || undefined
}

const getValueFromBody = (field, body) => {
  // blue('findInBody', { field, body })
  const r = pick([field], body)

  return r[field] || undefined
}

const checkType = (expectedType, value) => {
  const valueToCheck = toString(value)
  // blue('valueToCheck', valueToCheck)
  let err = undefined

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
      blue('case mongoId', typeof valueToCheck)
      if (!isMongoId(valueToCheck)) {
        blue('!isMongoId')
        err = createError(schema[i], valueToCheck)
        blue('!isMongoId: err', err)
      }
    default:
      throw new Error(`validateRequest.checkType ERROR: unknown expectedType: ${expectedType}`)
  }
  return err
}

const validateRequest = schema => {
  return (req, res, next) => {
    const { body, params } = req
    const stringBody = map(toString, body)
    // blue('params', params)
    const errors = []

    for (let i = 0; i < schema.length; i++) {
      const { field, location, expectedType, errorMessage } = schema[i]
      let err = undefined
      // blue('location', location)
      blue('params', params)
      const fieldValue =
        location === 'params'
          ? getValueFromParams(field, params)
          : getValueFromBody(field, stringBody)

      // blue('valueToCheck', fieldValue)
      if (fieldValue === undefined) {

        if (schema[i].required === undefined || schema[i].required) {
          err = createError(schema[i], fieldValue)
        }
        
      } else {

      }
      if (!(err === undefined)) {
        errors.push(err)
      }
    }
    blue('errors', errors)
    // blue('body', typeof body)
    // const newBody = mergeRight(body, { errors })
    // req.body = newBody

    // blue('req.body', req.body)
    blue('errors.length', errors.length)
    if (errors.length > 0) {
      return res.status(422).json({ errors })
    } else {
      next()
    }
  }
}

export default validateRequest
