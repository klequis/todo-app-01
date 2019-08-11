export const isHexString = hexId => {
  const checkForHexString = new RegExp('^[0-9a-fA-F]{24}$')
  if (!hexId) {
    return false
  }
  return checkForHexString.test(hexId)
}
