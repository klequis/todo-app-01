import { isHexString } from './isHexString'
import { green } from 'logger'

const parseId = userId => {
  const a = userId.split('|')
  return a[1]
}

export const isValidAuth0UserId = userId => {
    green('isValidAuth0UserId: userId', userId)
    // e.g., "auth0|5d1c...7"
    if (userId === undefined) {
      return false
    }
    const id = parseId(userId)
    return isHexString(id)
}