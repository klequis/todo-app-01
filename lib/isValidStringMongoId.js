export const isValidStringMongoId = id => {
  let _id = ''
  try {
    if (!id) {
      return false
    } else {
      typeof id !== 'string' ? (_id = id.toString()) : (_id = id)
    }
    return checkForHexString.test(_id)
  } catch (e) {
    red(e)
    return false
  }
}
