import { blue } from 'logger'
import { isBoolean, isISO8601, isMongoId } from 'validator'
import { map, mergeRight } from 'ramda'
import { stringify } from 'querystring'

// R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}

const addError = error => {}

// const toString = (value) => {
//   if (typeof value === 'string') {
//     return value
//   } else {
//     return value.toString()
//   }

// }



const example = {
  value: '',
  in: 'body || params',
  msg: '',
  param: '',
  location: ''
}





/*


OK, you likely want to use Ramda to see 
- if the field is in the body or params
- get the value if it is

*/

/*
    and you are going to create a validation function 
    that takes a schema object !!
 */

//  const check = (rule) => {

//  }





const patchValidation2 = function(req, res, next) {
  return (req, res, next) => obj  => function(req, res, next) {
    // const { req, res, next } = p
    
    const { body, params } = req
    blue('body', body)
    blue('params', params)
    const errors = []
    for (let i = 0; i < schema.length; i++) {
      const { field, location, expectedType, value, errorMessage } = schema[i]
      let err = {}
      const { _id } = params
      switch (expectedType) {
        case 'boolean':
          if (!isBoolean(value)) {
            err = createError(schema[i])
          }
          break
        case 'date':
          if (!isISO8601(value)) {
            err = createError(schema[i])
          }
          break
        case 'mongoId':
          if (!isMongoId(value)) {
            err = createError(schema[i])
          }
      }
      errors.push(err)
    }

    blue('body', typeof body)
    const newBody = mergeRight(body, { errors })
    req.body = newBody

    blue('req.body', req.body)
    next()
  }
}

const patchValidation1 = function(req, res, next) {
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
