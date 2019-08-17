import express from 'express'
import todoGet from './todoGet'
import todoPost, { postValidationSchema } from './todoPost'
import todoDelete, { deleteValidationSchema } from './todoDelete'
import todoGetById, { getByIdValidationSchema } from './todoGetById'
import todoPatch, { patchValidationSchema } from './todoPatch'
import { checkSchema } from 'express-validator'


const router = express.Router()

router.delete('/:userid/:todoid', checkSchema(deleteValidationSchema), todoDelete)
router.get('/:userid', todoGet)
router.get('/:userid/:todoid', checkSchema(getByIdValidationSchema), todoGetById)
router.patch('/:userid/:todoid', checkSchema(patchValidationSchema), todoPatch)
// router.patch('/:id/todoid', todoPatch)
router.post('/:userid', checkSchema(postValidationSchema), todoPost)
// router.post('/:userid', todoPost)


export default router


