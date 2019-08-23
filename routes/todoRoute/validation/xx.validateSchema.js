import { map, without } from 'ramda'
import { isEmpty } from 'validator'
import { hasProp } from 'lib'

export const typeMongoIdString = 'mongoId'
export const typeBoolean = 'boolean'
export const typeISODateString = 'isoDateString'
export const typeString = 'string'
export const typeUUID = 'uuid'

const schemaFields = ['field', 'location', 'expectedType', 'required']

const checkFieldSchema = schemaField => {
  const keys = Object.keys(schemaField)
  
  const fieldsToCheck = keys.includes('required')
    ? schemaFields
    : without(['required'], schemaFields)

  fieldsToCheck.forEach(f => {
    if (!keys.includes(f)) {
      throw new Error(`A valid schema must include a '${f}' property.`)
    }
    if (isEmpty(schemaField[f])) {
      throw new Error(`Schema property '${f}' has no value.`)
    }
  })
}

const validateSchema = schema => {

  schema.forEach(s => {
    const s1 = map(toString, s)
    checkFieldSchema(s1)
  })
}

export default validateSchema
