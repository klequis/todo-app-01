import { isBoolean, isISO8601, isMongoId, isUUID, isLength } from 'validator'
import { pick } from 'ramda'
import { toString } from 'lib'
import { blue, yellow, red, greenf, redf, green } from 'logger'
import validateSchema, {
  typeMongoIdString,
  typeBoolean,
  typeISODateString,
  typeString,
  typeUUID
} from './validateSchema'

const createTypeErrorMessage = (expectedType, field) => {
  return `${field} must be ${expectedType}`
  // switch (expectedType) {
  //   case typeMongoIdString:
  //     return `${field} must be a valid MongodDB ObjectID as string.`
  //   case typeBoolean:
  //     return `${field} must be a boolean value.`
  //   case typeISODateString:
  //     return `${field} must be an ISODateString.`
  //   case typeString:
  //     return `${field} must be a string.`
  // }
}

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
  const { field, location, expectedType} = fieldSchema
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

/**
 * 
 * @param {object} fieldSchema 
 * @param {any} fieldValueRaw 
 * @returns error from createError() || undefined err only one error
 */
const checkType = (fieldSchema, fieldValueRaw) => {
  // blue('checkType: fieldSchema.field', fieldSchema.field)
  // blue('checkType: fieldValueRaw', fieldValueRaw)
  const fieldValueAsString = toString(fieldValueRaw)
  const { expectedType } = fieldSchema
  blue('fieldSchema', fieldSchema)
  let err = undefined
  let isErr = false
  switch (expectedType) {
    case typeBoolean:
      if (!isBoolean(fieldValueAsString)) {
        yellow('err isBoolean')
        isErr = true
        // err = createTypeError(fieldSchema, fieldValueAsString)
        // err = createError(fieldSchema, {} , fieldValueAsString, 'it should be a boolean')
        
      }
      break
    case typeISODateString:
      if (!isISO8601(fieldValueAsString)) {
        yellow('err isISO8601')
        isErr = true
      }
      break
    case typeMongoIdString:
      if (!isMongoId(fieldValueAsString)) {
        yellow('err isMongoId')
        isErr = true
      }
      break
    case typeUUID:
      if (!isUUID(fieldValueAsString, 4)) {
        yellow('err isUUID')
        isErr = true
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
  if (isErr) {
    return createError({
      fieldSchema,
      valueReceived: fieldValueAsString,
      errorMessage: createTypeErrorMessage(fieldSchema, fieldValueAsString)
    })
  }
  return undefined
}

const minLength = (value, length) => {
  if (!isLength(value, {min: length})) {
    return `minLenght must be ${length}`
  } else {
    return 'it was Ok'
  }
} 

/**
 * 
 * @param {*} rules 
 * @param {*} fieldValueRaw 
 * 
 * @returns array of errors
 */
const checkRules = (fieldSchema, fieldValueRaw) => {
  const errors = []
  // blue('rules', typeof rules)
  const { rules } = fieldSchema
  if (rules === undefined) {
    return undefined
  }

  // TODO: this should be in validateSchema
  if (typeof rules !== 'object' || Array.isArray(rules)) {
    throw new Error('rules poperty of fieldSchema must be an object')
  }
  // TODO

  Object.keys(rules).forEach(rule => {
    let err = undefined
    
    const ruleValue = rules[rule]
    blue('rule', `rule: ${rule}, value ${ruleValue}`)
    const { field } = fieldSchema
    switch (rule) {
      
      case 'minLength':
        
        const msg = minLength(toString(fieldValueRaw), ruleValue)
        
        if (msg !== '') {
          // blue('*********** msg', msg)
          // err = createRuleError(fieldSchema, rule, fieldValueRaw, ruleValue, msg)
          err = createError({
            fieldSchema,
            rule,
            valueReceived: fieldValueRaw,
            errorMessage: `${field} must be at least ${fieldValueRaw} characters.`
          })
        }
        
      default:
        // do nothing for now
    }
    if (err !== undefined) {
      errors.push(err)
    }
    
  })
  blue('checkRules: errors', errors)
  return errors
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
    // blue('params', params)
    const errors = []

    let numNoError = 0
    let numWithError = 0


    // could I do this wil map and return an array
    // to avoid mutating errors with push()
    schema.forEach(fieldSchema => {
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

        const typeErr = checkType(fieldSchema, fieldValueRaw)
        const ruleErrs = checkRules(fieldSchema, fieldValueRaw)

        // blue('numErrors', errors.length)
        console.log()
      }

      if ((err = undefined)) {
        numNoError++
      } else {
        numWithError++
      }
      
    }) // ends the forEach

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
    // return res.status(422).json({ errors })
    const errors = [...typeErr, ...ruleErrs]
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