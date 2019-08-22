import { green } from 'logger'
export const findObjectInArray = (arr, findProp, findValue) => {
  // green('arr', arr)
  // green('findProp', findProp)
  // green('findValue', findValue)
  const idx = arr.findIndex(i => i[findProp] === findValue)
  return arr[idx]
}
