import { expect } from 'chai'
import {
  aNewTodoWithDueDate,
  aNewTodoWithoutDueDate,
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

function diffDateTime(date1, date2) {
  let d1
  let d2
  if (typeof date1 === 'object') {
    d1 = date1.toISOString()
  } else {
    d1 = date1
  }
  if (typeof date2 === 'object') {
    d2 = date2.toISOString()
  } else {
    d2 = date2
  }
  return differenceInMilliseconds(new Date(d1), new Date(d2))
  
}

describe('todo-route POST', function() {
  let token = undefined

  before(async function() {
    token = await getToken()
  })

  describe('test POST /api/todo', function() {
    before(async function() {
      await dropCollection(TODO_COLLECTION_NAME)
    })
    it('new todo with dueDate', async function() {
      const todoSent = aNewTodoWithDueDate
      yellow('todoSent', todoSent)
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 200,
        body: todoSent,
        token,
      })
      const { body } = r
      expect(body.length).to.equal(1)
      const todo = body[0]
      // _id - new todo does not have an _id
      // completed
      expect(todo.completed).to.equal(false)
      // createdAt - allow 400 miliseconds diffence
      const diffCreatedAt = diffDateTime(todo.createdAt, new Date())
      expect(Math.abs(diffCreatedAt)).to.be.lessThan(400)
      // dueDate
      expect(todo.dueDate).to.equal(todoSent.dueDate)
      // lastUpdateAt
      const diffLastUpdated = diffDateTime(todo.lastUpdatedAt, new Date())
      expect(Math.abs(diffLastUpdated)).to.be.lessThan(400)
      // title
      expect(todo.title).to.equal(todoSent.title)
      // userId
      expect(todo.userId).to.equal(todoSent.userId)

    })
    it('new todo without dueDate', async function() {
      const todoSent = aNewTodoWithoutDueDate
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 200,
        body: todoSent,
        token
      })
      const { body } = r
      expect(body.length).to.equal(1)
      const todo = body[0]
      // _id - new todo does not have an _id
      // completed
      expect(todo.completed).to.equal(false)
      // createdAt - allow 400 miliseconds diffence
      const diffCreatedAt = diffDateTime(todo.createdAt, new Date())
      expect(Math.abs(diffCreatedAt)).to.be.lessThan(400)
      // dueDate
      expect(todo.dueDate).to.equal(null)
      // lastUpdateAt
      const diffLastUpdated = diffDateTime(todo.lastUpdatedAt, new Date())
      expect(Math.abs(diffLastUpdated)).to.be.lessThan(400)
      // title
      expect(todo.title).to.equal(todoSent.title)
      // userId
      expect(todo.userId).to.equal(todoSent.userId)
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
