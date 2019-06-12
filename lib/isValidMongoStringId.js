const checkForHexString = new RegExp('^[0-9a-fA-F]{24}$')
export const isValidMongoStringId = id => {
  let _id = ''
  try {
    if (!id) {
      return false
    } else {
      _id = typeof id !== 'string' ? id.toString() : _id = id
    }
    return checkForHexString.test(_id)
  } catch (e) {
    return false
  }
}

// export const isValidMongoId = id => {
//   try {
//     if (typeof id === 'string') {
//       let _id = ''
//       if (!id) {
//         return false
//       } else {
//         _id = typeof id !== 'string' ? id.toString() : (_id = id)
//       }
//       return checkForHexString.test(_id)
//     } else {
      
//     }
//   } catch (e) {
//     return false
//   }
// }
