import { isEmpty, isNil } from 'ramda'
import { hasProp } from 'lib'
import { yellow, blue } from 'logger'

// null or undefined, empty

const validateType = (obj, objType) => {
  // yellow('objType', objType)
  let errors = []
  const result = objType.fields.map(f => {
    // blue('name', f.name)
    // blue('dataTypes', f.dataTypes)
    // blue('minLength', typeof f.minLength)
    const required = f.required === undefined ? false : f.required
    blue('required', required)
    // const fieldName = f.name
    // yellow('fieldName', fieldName)

    // is the field required
    // const required = f.required || false
    // yellow('required', required)
    // does obj have the field
    // const hasField = hasProp(fieldName, obj)
    // yellow('hasField', hasField)

    // is it the right type

    // [optional] is it the right length

    
    // const fieldValue = obj[fieldName]

  })
  return { errorCount: errors.length, errors: errors }
}


export default validateType


// const validateType = (obj, objType) => {
//   yellow('obj', obj)
//   const errors = []
//   if (typeof obj !== 'object') {
//     errors.push({ incorrectParameter: `parameter "obj" must be an object` })
//   } else if (isNil(obj) || isEmpty(obj)) {
//     errors.push({
//       incorrectParameter: `parameter obj is null, undefined or empty`
//     })
//   } else {
//     Object.keys(objType).map(fieldName => {
//       const dataType = objType[fieldName].type
//       const minLen = objType[fieldName].minLength || null
//       const fieldValue = obj[fieldName]
//       // first check if it has the required props

//       if (typeof fieldValue in dataType) {
//         errors.push({
//           [fieldName]: `Incorrect data type. Should be ${dataType}`
//         })
//       }
//       if (/*dataType === 'string' &&*/ minLen !== null) {
//         if (fieldValue.length < minLen) {
//           errors.push({
//             [fieldName]: `Incorrect length. Should be >= ${minLen}`
//           })
//         }
//       }
//     })
//   }

//   return { errorCount: errors.length, errors: errors }
// }
