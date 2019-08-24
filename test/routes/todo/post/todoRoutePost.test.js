import { expect } from 'chai'
import {
  aNewTodoWithDueDate,
  aNewTodoWithoutDueDate,
  todoInvalidUserIdInBody,
  todoMissingUserIdInBody,
  todoTitleTooShort
} from './fixture'
import { dropCollection } from 'db'
import getToken from 'test/getToken'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { differenceInMilliseconds } from 'date-fns'
import config from 'config'
import { addDays } from 'date-fns'

import { yellow } from 'logger'

const cfg = config()
const auth0UUID = cfg.testUser.auth0UUID

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
      const todoSent = {
        dueDate: addDays(new Date(), 1).toISOString(),
        title: 'post: new todo with due date',
        userId: auth0UUID
      }
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
      const todoSent = {
        title: 'post: new todo w/o dueDate',
        userId: auth0UUID
      }
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
        const todoSent = {
          title: 'post: missing userId in body'
        }
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
        expect(errors[0].msg).to.equal('010: field userId is not valid')
      })
      it('invalid userId in body', async function() {
        const todoSent = {
          title: 'a good todo',
          userId: 'aaaa-bbbb'
        }
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
        expect(errors[0].msg).to.equal('010: field userId is not valid')
      })
      it('title too short', async function() {
        const todoSent = {
          title: 'aa',
          userId: auth0UUID
        }
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
          '009: field title must be at least 3 character but not more than 30 characters.'
        )
      })
    })
  })
})
