import express from 'express'
import todoGet from './todoGet'
import todoPost, { postValidationSchema } from './todoPost'
import todoDelete, { deleteValidationSchema } from './todoDelete'
import todoGetById, { getByIdValidationSchema } from './todoGetById'
import todoPatch, { patchValidationSchema } from './todoPatch'
import { checkSchema } from 'express-validator'


const router = express.Router()

router.delete('/:id', checkSchema(deleteValidationSchema), todoDelete)
router.get('/', todoGet)
router.get('/:id', checkSchema(getByIdValidationSchema), todoGetById)
router.patch('/:id', checkSchema(patchValidationSchema), todoPatch)
// router.patch('/:id', todoPatch)
router.post('/', checkSchema(postValidationSchema), todoPost)


export default router


