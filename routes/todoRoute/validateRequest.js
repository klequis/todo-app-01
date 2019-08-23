import { isBoolean, isISO8601, isMongoId, isUUID, isLength } from 'validator'
import { concat, pick } from 'ramda'
import { toString } from 'lib'
import { blue, yellow, red, greenf, redf, green } from 'logger'
import validateSchema, {
  typeMongoIdString,
  typeBoolean,
  typeISODateString,
  typeString,
  typeUUID
} from './validateSchema'

/**
 * @description creates error objects for type errors or rule errors
 *   if type error, rule === undefiend
 *   if rule error, rule === { property: value }
 * @param {*} fieldSchema
 * @param {*} rule eg., { minLength: 2 }
 * @param {*} valueReceived value received from the client
 * @param {*} errorMessage error message to send to the client
 */

const createError = ({
  fieldSchema,
  rule = undefined,
  valueReceived,
  errorMessage
}) => {
  const { field, location, expectedType } = fieldSchema
  return {
    field: field,
    location: location,
    expectedType: rule === undefined ? expectedType : '',
    rule: rule === undefined ? '' : rule,
    valueReceived: valueReceived,
    errorMessage: errorMessage
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

const checkType = (fieldSchema, fieldValueAsString) => {
  const { expectedType } = fieldSchema
  switch (expectedType) {
    case typeBoolean:
      return isBoolean(fieldValueAsString)
    case typeISODateString:
      return isISO8601(fieldValueAsString)
    case typeMongoIdString:
      return isMongoId(fieldValueAsString)
    case typeUUID:
      return isUUID(fieldValueAsString, 4)
    case typeString:
      // since valueToCheck was converted to string above
      // a check for isString here would always be true
      // strings will be further evaluated in checkRules()
      return true

    default:
      red('unknown type', expectedType)
    // throw new Error(
    //   `validateRequest.checkType ERROR: unknown expectedType: ${expectedType}`
    // )
  }
}

/**
 *
 * @param {object} fieldSchema
 * @param {any} fieldValueRaw
 * @returns error from createError() || undefined err only one error
 */
const checkTypes = ({ schema, body, params }) => {
  const { location, field } = schema
  const value =
    location === 'params'
      ? getValueFromParams(field, params)
      : getValueFromBody(field, body)
  const fieldValue = toString(value)
  
  return schema
    .map(fieldSchema => {
      const check = checkType(fieldSchema, fieldValue)
      const { expectedType } = fieldSchema
      return !check
        ? createError({
            fieldSchema,
            valueReceived: fieldValue,
            errorMessage: `Field ${field} must be of type ${expectedType}`
          })
        : undefined
    })
    .filter(i => i !== undefined)
}

const getFieldValue = (fieldSchema, body, params) => {
  const { field, location } = fieldSchema
  return location === 'params'
    ? getValueFromParams(field, params)
    : getValueFromBody(field, body)
}

const checkRule = (rule, ruleValue, field, receivedValue) => {
  switch (rule) {
    case 'minLength':
      return isLength(toString(receivedValue), { min: ruleValue })
        ? ''
        : `Field ${field} must be at least ${ruleValue} characters. Received ${receivedValue}.`

    default:
      // TODO: throw an error here
      return ''
  }
}

/**
 *
 * @param {*} rules
 * @param {*} fieldValueRaw
 *
 * @returns array of errors
 */
const checkRules = ({ schema, body, params }) => {
  const errors = schema.map(fieldSchema => {
    // blue('fieldSchema', fieldSchema)
    const rules = fieldSchema.rules || []

    const errs = Object.keys(rules)
      .map(rule => {
        // blue('** rule', rule)

        const ruleValue = rules[rule]
        // blue('** ruleValue', ruleValue)

        const receivedValue = getFieldValue(fieldSchema, body, params)
        // blue('** receivedValue', receivedValue)

        const { field } = fieldSchema
        // blue('** field', field)

        const msg = checkRule(rule, ruleValue, field, receivedValue)
        // blue('** msg', msg)

        return msg !== ''
          ? createError({
              fieldSchema,
              rule,
              valueReceived: receivedValue || '',
              errorMessage: msg
            })
          : undefined
      })
      .filter(i => i !== undefined)
      // blue('errs', errs)
      return errs
  })

  return errors.reduce(function(accumulator, currentValue) {
    return accumulator.concat(currentValue)
  }, [])

}

const shouldProcess = (fieldSchema, fieldValueRaw) => {
  const schemaFieldRequired = pick(['required'], fieldSchema).required

  if (schemaFieldRequired === false && fieldValueRaw === undefined) {
    return false
  }
  return true
}

const validateRequest = schema => {
  validateSchema(schema)

  return (req, res, next) => {
    const { body, params } = req

    // const stringBody = map(toString, body)
    blue('body', body)
    blue('params', params)

    let numNoError = 0
    let numWithError = 0

    // Types
    const typeErrs = checkTypes({ schema, body, params })
    const ruleErrs = checkRules({ schema, body, params })
    // blue('typeErrs', typeErrs)
    // blue('ruleErrs', ruleErrs)
    const errors = [...typeErrs, ...ruleErrs]
    blue('errors', errors)
    
    // const errors = schema.map(fieldSchema => {
    //   const { field, location } = fieldSchema

    //   const process = shouldProcess(fieldSchema, fieldValueRaw)
    //   // yellow(`process=${process}, field=${field}, fieldValueRaw=${fieldValueRaw} type=${typeof fieldValueRaw}`)

    //   let typeErr
    //   let ruleErrs

    //   if (process) {
    //
    //
    //   }
    //   // blue('typeErr', typeErr)
    //   blue('ruleErrs', ...[ruleErrs])
    //   return []
    // })

    // blue('errors', errors)
    return res.status(422).json({})

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
      greenf(`Number of errors: ${errors.length}`)
    }
    console.log()
    console.groupEnd()

    blue('errors', errors)

    // const errors = [...typeErr, ...ruleErrs]
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

const errors = [
  [
    {
      field: '_id',
      location: 'body',
      expectedType: 'mongoId',
      rule: '',
      valueReceived: '123',
      errorMessage: '123 must be [object Object]'
    },
    undefined
  ],
  [
    {
      field: 'completed',
      location: 'body',
      expectedType: 'boolean',
      rule: '',
      valueReceived: '',
      errorMessage: ' must be [object Object]'
    },
    undefined
  ],
  [
    {
      field: 'createdAt',
      location: 'body',
      expectedType: 'isoDateString',
      rule: '',
      valueReceived: '',
      errorMessage: ' must be [object Object]'
    },
    undefined
  ],
  [undefined, undefined],
  [
    {
      field: 'lastUpdatedAt',
      location: 'body',
      expectedType: 'isoDateString',
      rule: '',
      valueReceived: '',
      errorMessage: ' must be [object Object]'
    },
    undefined
  ],
  [
    {
      field: 'todoid',
      location: 'params',
      expectedType: 'mongoId',
      rule: '',
      valueReceived: 'undefined',
      errorMessage: 'undefined must be [object Object]'
    },
    undefined
  ],
  [undefined, [[Object]]],
  [
    {
      field: 'userId',
      location: 'body',
      expectedType: 'uuid',
      rule: '',
      valueReceived: '123',
      errorMessage: '123 must be [object Object]'
    },
    undefined
  ],
  [undefined, undefined]
]

// const createRuleError = (fieldSchema, rule, fieldValueRaw, ruleValue, message) => {
//   const { field, location } = fieldSchema
//   return {
//     field: field,
//     location: location,
//     expected: rule,
//     value: fieldValueRaw,
//     errorMessage: message

//   }
// }

// const rule = {
//   rule: { minLength: 2 },
//   message: 'title must be at least 2 characters long'
// }

// const ruleError = {
//   field: 'title', // fieldSchema.field
//   location: 'body', // fieldSchema.location
//   typeExpected: '', // fieldSchema.expectedType || rule
//   typeReceived: 'ab', // typeof value
//   rule: { minLength: 3 },
//   value: 'ab', // fieldValueRaw
//   errorMessage: `${field} must be at least 2 characters long` // typeErrorMessage(expectedType, field) || message
// }

// const typeError = {
//   field: '_id',
//   location: 'body',
//   typeExpected: 'mongoId',
//   typeReceived: 'string',
//   rule: {},
//   value: '123',
//   errorMessage: '_id must be a valid MongodDB ObjectID as string.'
// }

// const createTypeError = (fieldSchema, valueReceived) => {
//   const { field, location, expectedType } = fieldSchema
//   return {
//     field: field,
//     location: location,
//     expected: expectedType,
//     received: typeof valueReceived,
//     valueReceived: valueReceived,
//     errorMessage: typeErrorMessage(expectedType, field)
//   }
// }
