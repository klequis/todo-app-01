import { expect } from 'chai'
import {
  todoMinimumFieldsForPost,
  todoMissingUserId,
  todoInvalidUserId,
  todoJunkUserId,
  todoMissingTitle,
  todoTitleTooShort,
  todoEmptyTitle
} from './fixture'
import { dropCollection } from 'db'
import getToken from 'test/get-token'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { differenceInMilliseconds } from 'date-fns'

import { yellow } from 'logger'

const titleTooShortMsg = 'Title must be at least 3 characters long.'

const unknownUser = 'Unknown user.' // also used for not valid

const postUri = '/api/todo'

describe('todo-route POST', function() {
  let token = undefined

  before(async function() {
    token = await getToken()
  })

  describe('test POST /api/todo', function() {
    before(async function() {
      await dropCollection(TODO_COLLECTION_NAME)
    })
    it('should post 1 todo', async function() {
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 200,
        body: todoMinimumFieldsForPost,
        token
      })
      const { body } = r
      const todo = body[0]
      const diff = differenceInMilliseconds(
        new Date(todo.createdAt),
        new Date()
      )
      expect(Math.abs(diff)).to.be.lessThan(4000)
      expect(todo.dueDate).to.equal(null)
      expect(todo.userId).to.equal(todoMinimumFieldsForPost.userId)
      expect(todo.title).to.equal(todoMinimumFieldsForPost.title)
      expect(todo.completed).to.equal(false)
    })

    it('should fail validation - missing userId', async function() {
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 422,
        body: todoMissingUserId,
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(unknownUser)
    })

    it('should fail validation - mutated guid', async function() {
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 422,
        body: todoInvalidUserId,
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(unknownUser)
    })
    it('should fail validation - invalid email missing @', async function() {
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 422,
        body: todoJunkUserId,
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(unknownUser)
    })
    it('should fail validation - missing title', async function() {
      const r = await sendRequest({
        method: 'POST', 
        uri: postUri,
        status: 422,
        body: todoMissingTitle,
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(titleTooShortMsg)
    })
    it('should fail validation - title too short', async function() {
      const r = await sendRequest({
        method: 'POST', 
        uri: postUri,
        status: 422,
        body: todoTitleTooShort,
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(titleTooShortMsg)
    })
    it('should fail validation - empty title', async function() {
      const r = await sendRequest({
        method: 'POST', 
        uri: postUri,
        status: 422,
        body: todoEmptyTitle,
        token})
      const { errors } = r.body
      expect(errors[0].msg).to.equal(titleTooShortMsg)
    })
  })
})
