import { ObjectID } from 'mongodb'
import { omit } from 'ramda'

export const removeIdProp = obj => {
  return omit(['_id'], obj)
}