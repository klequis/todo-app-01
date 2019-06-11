import { path, isNil } from 'ramda'
import { yellow, red } from 'logger'

export const hasProp = (prop, obj) => {
  if (isNil(obj)) {
    return false
  }
  return path(prop.split('.'), obj) === undefined ? false : true
}
