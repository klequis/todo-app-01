import { ObjectID } from 'mongodb'
import { omit } from 'ramda'

const checkForHexString = new RegExp('^[0-9a-fA-F]{24}$')

export const removeIdProp = obj => {
  return omit(['_id'], obj)
}