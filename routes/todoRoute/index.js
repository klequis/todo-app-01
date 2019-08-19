import express from 'express'
import todoGet from './todoGet'
import todoPost, { postValidationSchema } from './todoPost'
import todoDelete, { deleteValidationSchema } from './todoDelete'
import todoGetById, { getByIdValidationSchema } from './todoGetById'
import todoPatch from './todoPatch'
import todoPatchSchema from './todoPatchSchema'
import validateRequest from './validateRequest'

import { patchValidation, cb1 } from './patchValidation'

import { checkSchema } from 'express-validator'


const heyhey = function(req, res, next) {
  console.log('hey hey')
  next()
}

// var cb1 = function(req, res, next) {
//   console.log('CB1')
//   next()
// }

const obj = {
  msg: 'Hello'
}

console.log('todopatchschema', todoPatchSchema)

const router = express.Router()

router.delete('/:userid/:todoid', checkSchema(deleteValidationSchema), todoDelete)
router.get('/:userid', todoGet)
router.get('/:userid/:todoid', checkSchema(getByIdValidationSchema), todoGetById)
router.patch('/:userid/:todoid', 
  // checkSchema(patchValidationSchema),
  validateRequest(todoPatchSchema),
todoPatch)
// router.patch('/:id/todoid', todoPatch)
router.post('/:userid', checkSchema(postValidationSchema), todoPost)
// router.post('/:userid', todoPost)


export default router




