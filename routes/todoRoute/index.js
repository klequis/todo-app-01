import express from 'express'
import todoGet from './todoGet'
import todoGetById from './todoGetById'
import todoDelete from './todoDelete'
import todoPatch from './todoPatch'
import todoPost from './todoPost'

import todoPatchValidation from './validation/todoPatchValidation'
import todoPostValidation from './validation/todoPostValidation'

const router = express.Router()

router.delete(
  '/:userid/:todoid',
  todoDelete
)
router.get('/:userid', todoGet)
router.get(
  '/:userid/:todoid',
  todoGetById
)
router.patch('/:userid/:todoid', todoPatchValidation, todoPatch)
// router.patch('/:id/todoid', todoPatch)
router.post('/:userid', todoPostValidation, todoPost)
// router.post('/:userid', todoPost)

export default router
