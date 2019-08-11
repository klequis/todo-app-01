import express from 'express'
import {
  find,
  findById,
  insertOne,
  findOneAndDelete,
  findOneAndUpdate
} from 'db'
import { validationResult, checkSchema } from 'express-validator'
import { removeIdProp } from 'db/helpers'
import wrap from '../wrap'

import {
  filterFields,
  postValidationSchema
} from './todo-route-validation'

import { post } from './todoPost'
import { patch } from './todoPatch'
import { get } from './todoGet'
import { del } from './todoDelete'
import { getById } from './todoGetById'

const collectionName = 'todos'
const router = express.Router()

router.post
router.patch
router.get
router.del
router.getById


export default router