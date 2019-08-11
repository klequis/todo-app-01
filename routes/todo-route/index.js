import express from 'express'
import todoGet from './todoGet'
import todoPost, { postValidationSchema } from './todoPost'
import todoDelete, { deleteValidationSchema } from './todoDelete'
import todoGetById, { getByIdValidationSchema } from './todoGetById'
import { checkSchema, check } from 'express-validator'


const router = express.Router()

router.get('/', todoGet)
router.post('/', checkSchema(postValidationSchema), todoPost)
router.delete('/:id', checkSchema(deleteValidationSchema), todoDelete)
router.get('/:id', checkSchema(getByIdValidationSchema), todoGetById)

export default router


