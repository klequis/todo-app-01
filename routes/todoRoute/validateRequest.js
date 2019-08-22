import { isBoolean, isISO8601, isMongoId, isEmpty, isUUID } from 'validator'
import { map, mergeRight, pick, without } from 'ramda'
import { hasProp, isValidAuth0UserId } from 'lib'
import { blue, yellow, red, greenf, redf, green } from 'logger'
import { isString } from 'util'

export const typeMongoIdString = 'mongoId'
export const typeBoolean = 'boolean'
export const typeISODateString = 'isoDateString'
export const typeString = 'string'

export const typeUUID = 'uuid'

const schemaFields = ['field', 'location', 'expectedType', 'required']

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

const typeErrorMessage = (expectedType, field) => {
  switch (expectedType) {
    case typeMongoIdString:
      return `${field} must be a valid MongodDB ObjectID as string.`
    case typeBoolean:
      return `${field} must be a boolean value.`
    case typeISODateString:
      return `${field} must be an ISODateString.`
    case typeString:
      return `${field} must be a string.`
  }
}


const createError = (rule, value) => {
  const { field, location, expectedType, errorMessage } = rule
  return {
    field: field,
    location: location,
    expected: expectedType,
    received: typeof value,
    value: value,
    errorMessage: typeErrorMessage(expectedType, field)
  }
}

const getValueFromParams = (field, params) => {
  const r = pick([field], params)
  return r[field] || undefined
}

const getValueFromBody = (field, body) => {
  const r = pick([field], body)
  return r[field] || undefined
}

const checkFieldSchema = schema => {
  
  const keys = Object.keys(schema)
  const fieldsToCheck = keys.includes('required')
    ? schemaFields
    : without(['required'], schemaFields)
  fieldsToCheck.forEach(f => {
    if (!keys.includes(f)) {
      throw new Error(`A valid schema must include a '${f}' property.`)
    }
    if (isEmpty(schema[f])) {
      throw new Error(`Schema property '${f}' has no value.`)
    }
  })
}

const validateSchema = schema => {
  if (!Array.isArray(schema)) {
    throw new Error(`Schama must be an array. Received ${typeof schema}`)
  }

  schema.forEach(s => {
    const s1 = map(toString, s)
    checkFieldSchema(s1)
  })
}

const checkType = (fieldSchema, fieldValueRaw) => {
  blue('checkType: fieldSchema.field', fieldSchema.field)
  blue('checkType: fieldValueRaw', fieldValueRaw)
  const fieldValueAsString = toString(fieldValueRaw)
  const { expectedType } = fieldSchema
  let err = undefined
  switch (expectedType) {
    case typeBoolean:
      if (!isBoolean(fieldValueAsString)) {
        yellow('err isBoolean')
        err = createError(fieldSchema, fieldValueAsString)
      }
      break
    case typeISODateString:
      if (!isISO8601(fieldValueAsString)) {
        yellow('err isISO8601')
        err = createError(fieldSchema, fieldValueAsString)
      }
      break
    case typeMongoIdString:
      if (!isMongoId(fieldValueAsString)) {
        yellow('err isMongoId')
        err = createError(fieldSchema, fieldValueAsString)
      }
      break
    case typeUUID:
      if (!isUUID(fieldValueAsString, 4)) {
        yellow('err isUUID')
        err = createError(fieldSchema, fieldValueAsString)
      }
      break
    case typeString:
      // since valueToCheck was converted to string above
      // don't need to check for string here
      // strings will be further evaluated in checkRules()
      break

    default:
      red('unknown type', expectedType)
    // throw new Error(
    //   `validateRequest.checkType ERROR: unknown expectedType: ${expectedType}`
    // )
  }
  return err
}

const isFieldRequired = fieldSchema => {
  return fieldSchema.required === undefined || fieldSchema.required === true
}


const checkRules = (rules, fieldValueAsString) => {
  // blue('rules', typeof rules)
  if (rules === undefined) {
    return undefined
  }

  if (typeof rules !== 'object' || Array.isArray(rules)) {
    throw new Error('rules poperty of fieldSchema must be an object')
  }

  Object.keys(rules).forEach(rule => {
    blue('rule', rule)
  })
}

const shouldProcess = (fieldSchema, fieldValueRaw) => {
  const { required } = fieldSchema
  const isRequired = required || true
  // blue('typeof fieldValueRaw', typeof fieldValueRaw)
  // blue('isRequired', isRequired)
  return isRequired || fieldValueRaw !== undefined
}

const validateRequest = schema => {
  validateSchema(schema)

  return (req, res, next) => {
    const { body, params } = req

    // const stringBody = map(toString, body)
    blue('body', body)
    blue('params', params)
    const errors = []

    let numNoError = 0
    let numWithError = 0

    schema.forEach(fieldSchema => {
      if (fieldSchema.field === 'userId') {
        yellow('*************************************************************************8')
      }
      let err = undefined // Q
      const { field, location } = fieldSchema
      const fieldValueRaw =
        location === 'params'
          ? getValueFromParams(field, params)
          : getValueFromBody(field, body)

      const process = shouldProcess(fieldSchema, fieldValueRaw)
      // yellow(`process=${process}, field=${field}, fieldValueRaw=${fieldValueRaw} type=${typeof fieldValueRaw}`)
      
      
      if (process) {
        // blue('> processing ...')

        err = checkType(fieldSchema, fieldValueRaw)
        
        if (err === undefined) {
          const err = checkRules(fieldSchema.rules, fieldValueRaw)
          // if (e) append error(s)
        }
        // add the error?
        if (!(err === undefined)) {

          errors.push(err)
        } 

        // blue('numErrors', errors.length)
        console.log()
      }

      if ((err = undefined)) {
        numNoError++
      } else {
        numWithError++
      }
    })

    console.group('Number processed check')
    console.log()
    const numSchemaFields = schema.length
    const totalProcessed = numNoError + numWithError
    if (totalProcessed !== numSchemaFields) {
      redf(
        `ERROR: Expected to process ${numSchemaFields} but only processed ${totalProcessed}`
      )
    } else {
      greenf(`Processed ${totalProcessed} as expected`)
    }
    console.log()
    console.groupEnd()

    blue('errors', errors)
    // return res.status(422).json({ errors })

    if (errors.length > 0) {
      return res.status(422).json({
        errors
      })
    } else {
      next()
    }
  }
}

export default validateRequest
