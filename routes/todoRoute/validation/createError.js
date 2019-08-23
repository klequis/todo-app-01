const createError = (location, msg, param) => {
  return {
    location: location,
    msg,
    param: param
  }
}

export default createError