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

const shouldProcess = (fieldSchema, fieldValueRaw) => {
  const schemaFieldRequired = pick(['required'], fieldSchema).required

  if (schemaFieldRequired === false && fieldValueRaw === undefined) {
    return false
  }
  return true
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

const getFieldValue = (fieldSchema, body, params) => {
  const { field, location } = fieldSchema
  return location === 'params'
    ? getValueFromParams(field, params)
    : getValueFromBody(field, body)
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



const checkRule = (rule, ruleValue, field, receivedValue) => {
  const value = toString(receivedValue)
  blue('** value', value)  
  switch (rule) {
    case 'minLength':
      blue('** minLength')
      return isLength(value, { min: ruleValue })
        ? ''
        : `Field ${field} must be at least ${ruleValue} characters. Received '${receivedValue}'.`
    case 'maxLength':
      blue('** maxLength')
      // blue('ruleValue', ruleValue)
      // blue('value', value)
      return isLength(value, { max: ruleValue })
        ? ''
        : `Field ${field} must be less than ${ruleValue} characters. Received "${receivedValue}".`
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
        blue('** checking: ', rule)
        // blue('** rule', rule)

        const ruleValue = rules[rule]
        // blue('** ruleValue', ruleValue)

        const receivedValue = getFieldValue(fieldSchema, body, params)
        // blue('** receivedValue', receivedValue)

        const { field } = fieldSchema
        // blue('** field', field)

        const msg = checkRule(rule, ruleValue, field, receivedValue)
        blue('** msg', msg)

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
      blue('errs', errs)
      return errs
  })

  return errors.reduce(function(accumulator, currentValue) {
    return accumulator.concat(currentValue)
  }, [])

}

const validateRequest = schema => {
  validateSchema(schema)

  return (req, res, next) => {
    const { body, params } = req

    blue('body', body)
    blue('params', params)

    // let numNoError = 0
    // let numWithError = 0

    // Types
    const typeErrs = checkTypes({ schema, body, params })
    const ruleErrs = checkRules({ schema, body, params })
    const errors = [...typeErrs, ...ruleErrs]
    // blue('errors', errors)

    // return res.status(422).json({})

    // console.group('Number processed check')
    // console.log()
    // const numSchemaFields = schema.length
    // const totalProcessed = numNoError + numWithError
    // if (totalProcessed !== numSchemaFields) {
    //   redf(
    //     `ERROR: Expected to process ${numSchemaFields} but only processed ${totalProcessed}`
    //   )
    // } else {
    //   greenf(`Processed ${totalProcessed} as expected`)
    //   greenf(`Number of errors: ${errors.length}`)
    // }
    // console.log()
    // console.groupEnd()


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