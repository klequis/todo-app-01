import { isEmpty, isNil } from 'ramda'
import { yellow } from 'logger'

const validateType = (obj, objType) => {
  // yellow('obj', obj)
  const errors = []
  if (isNil(obj) || isEmpty(obj)) {
    errors.push({ inputError: `parameter obj is invalid type ${obj}` })
  } else {
    Object.keys(objType).map(fieldName => {
      const dataType = objType[fieldName].type
      const minLen = objType[fieldName].minLength || null
      const fieldValue = obj[fieldName]
      if (typeof fieldValue in dataType) {
        errors.push({
          [fieldName]: `Incorrect data type. Should be ${dataType}`
        })
      }
      if (/*dataType === 'string' &&*/ minLen !== null) {
        if (fieldValue.length < minLen) {
          errors.push({
            [fieldName]: `Incorrect length. Should be >= ${minLen}`
          })
        }
      }
    })
  }

  return { errorCount: errors.length, errors: errors }
}

export default validateType
