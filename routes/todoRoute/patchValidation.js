import { blue } from "../../logger";
import { isBoolean, isISO8601 } from 'validator'
import { map } from 'ramda'


// R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}

const addError = (error) => {

}

// const toString = (value) => {
//   if (typeof value === 'string') {
//     return value
//   } else {
//     return value.toString()
//   }

// }

export function toString(value, deep = true) {
  if (Array.isArray(value) && value.length && deep) {
    return toString(value[0], false)
  } else if (value instanceof Date) {
    return value.toISOString()
  } else if (value && typeof value === 'object' && value.toString) {
    return value.toString()
  } else if (value == null || (isNaN(value) && !value.length)) {
    return ''
  }

  return String(value)
}

const example = {
  value: '',
  in: 'body || params',
  msg: '',
  param: '',
  location: ''
}

const schema = [
  {
    field: '_id',
    location: 'param',
    dataType: 'boolean',
    value: '123'
  }
]


/*


OK, you likely want to use Ramda to see 
- if the field is in the body or params
- get the value if it is

*/

export const patchValidation = function(req, res, next) {
  const { body, params } = req
  for(let i; i<schema.length; i++) {
    const {field, location, dataType, value} =  schema[i]
    let err = {}
    const { _id } = params
    switch (dataType) {
      case 'boolean': 
        if (!isBoolean(value)) {
          err = {
            one: '',
            two: '',
          }
        }
    }
  }
  errors.push(err)
}

export const patchValidation1 = function(req, res, next) {
  const errors = []
  const { body, params } = req
  blue('body', body)
  blue('params', params)
  const y = map(toString, body)
  blue('y', y)
  const t = 'notBoolean'
  if (!isBoolean(y.completed)) {
    errors.push({
      value: y.completed,
      location: 'body',
      msg: 'completed must be true or false',
      param: 'completed'
      
    })
  }
  if (!isISO8601(y.createdAt)) {
    errors.push({
      value: y.createdAt,
      location: 'body',
      msg: 'completed must be true or false',
      param: 'completed'
    })
  } 
  
  blue('errors', errors)

  next()

}

export const cb1 = function(req, res, next) {
  console.log('CB1')
  next()
}





