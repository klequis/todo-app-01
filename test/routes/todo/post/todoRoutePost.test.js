import { expect } from 'chai'
import {
  aNewTodoWithDueDate,
  aNewTodoWithoutDueDate,
  auth0UUID,
  todoInvalidUserIdInBody,
  todoMissingUserIdInBody,
  todoTitleTooShort
} from './fixture'
import { dropCollection } from 'db'
import getToken from 'test/getToken'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { differenceInMilliseconds } from 'date-fns'

import { yellow } from 'logger'


const postUri = `/api/todo/${auth0UUID}`

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

describe.only('todoRoute POST', function() {
  let token = undefined

  before(async function() {
    token = await getToken()
  })
  describe('valid tests - should return 1 todo', function() {
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
        token
      })
      const { body } = r
      // yellow('body', body)
      expect(body.length).to.equal(1)
      const todo = body[0]
      expect(todo.completed).to.equal(false)
      const diffCreatedAt = diffDateTime(todo.createdAt, new Date())
      expect(Math.abs(diffCreatedAt)).to.be.lessThan(400)
      expect(todo.dueDate).to.equal(todoSent.dueDate)
      const diffLastUpdated = diffDateTime(todo.lastUpdatedAt, new Date())
      expect(Math.abs(diffLastUpdated)).to.be.lessThan(400)
      expect(todo.title).to.equal(todoSent.title)
      expect(todo.userId).to.equal(auth0UUID)
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
      // yellow('body', body)
      expect(body.length).to.equal(1)
      const todo = body[0]
      expect(todo.completed).to.equal(false)
      const diffCreatedAt = diffDateTime(todo.createdAt, new Date())
      expect(Math.abs(diffCreatedAt)).to.be.lessThan(400)
      expect(todo.dueDate).to.equal(null)
      const diffLastUpdated = diffDateTime(todo.lastUpdatedAt, new Date())
      expect(Math.abs(diffLastUpdated)).to.be.lessThan(400)
      expect(todo.title).to.equal(todoSent.title)
      expect(todo.userId).to.equal(auth0UUID)
    })

    describe('invalid tests - should return validation errors[]', function() {
      before(async function() {
        await dropCollection(TODO_COLLECTION_NAME)
      })
      it('missing userId in body', async function() {
        const todoSent = todoMissingUserIdInBody
        const r = await sendRequest({
          method: 'POST',
          uri: postUri,
          status: 422,
          body: todoSent,
          token
        })
        const { body } = r
        const { errors } = body
        expect(errors.length).to.equal(1)
        expect(errors[0].msg).to.equal('Unknown user')
      })
      it('invalid userId in body', async function() {
        const todoSent = todoInvalidUserIdInBody
        const r = await sendRequest({
          method: 'POST',
          uri: postUri,
          status: 422,
          body: todoSent,
          token
        })
        const { body } = r
        const { errors } = body
        expect(errors.length).to.equal(1)
        expect(errors[0].msg).to.equal('Unknown user')
      })
      it('title too short', async function() {
        const todoSent = todoTitleTooShort
        const r = await sendRequest({
          method: 'POST',
          uri: postUri,
          status: 422,
          body: todoSent,
          token
        })
        const { body } = r
        const { errors } = body
        expect(errors.length).to.equal(1)
        expect(errors[0].msg).to.equal(
          'Title must be at least 3 characters long.'
        )
      })
    })
  })
})
