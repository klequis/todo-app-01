import { isNullOrUndefined } from "util";
import { isEmpty, isNil } from 'ramda'
import { yellow } from 'logger'


const validateType = (obj, objType) => {
  yellow('obj', obj)
  if (isNil(obj) || isEmpty(obj)) {
    yellow('input not valid')
    return {inputError: `parameter obj is invalid type ${obj}`}
  } else {
    yellow('input is valid')
  }
  const errors = {}
  Object.keys(objType).map(fieldName => {
    const dataType = objType[fieldName].type
    const minLen = objType[fieldName].minLength || null
    const fieldValue = obj[fieldName]
    if (typeof fieldValue !== dataType) {
      errors.title = `${fieldName} has incorrect data type. It should be ${dataType}`
    }
    if (dataType === 'string' && minLen !== null) {
      if (fieldValue.length < minLen) {
        errors.minLength = `${fieldName} has incorrect length. It should be >= ${minLen}`
      }
    }
  })
  return errors
}

export default validateType