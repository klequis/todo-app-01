import express from 'express'
import todoGet from './todoGet'
import todoGetById from './todoGetById'
import todoDelete from './todoDelete'
import todoPatch from './todoPatch'
import todoPost from './todoPost'

// import todoPatchValidation from './validation/todoPatchValidation'
// import todoPostValidation from './validation/todoPostValidation'
import validation from './validation/validation'

const router = express.Router()

router.delete('/:userid/:todoid', validation, todoDelete)
router.get('/:userid', validation, todoGet)
router.get('/:userid/:todoid', validation, todoGetById)
router.patch('/:userid/:todoid', validation, todoPatch)
router.post('/:userid', validation, todoPost)

export default router
