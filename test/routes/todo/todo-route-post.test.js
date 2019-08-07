import { expect } from 'chai'
import request from 'supertest'
import { equals } from 'ramda'
import {
  goodTodo,
  missingEmailTodo,
  invalidEmailTodo01,
  invalidEmailTodo02,
  missingTitleTodo,
  titleTooShortTodo,
  codeTitleTodo,
  emptyTitleTodo
} from './fixture'
import app from 'server'
import { dropCollection } from 'db'
import getToken from 'test/get-token'
import sendRequest from 'test/sendRequest'

const collectionName = 'todos'

const titleTooShortMsg = 'Title must be at least 3 characters long.'

const invalidEmailMsg = 'Invalid or missing email.'

const postUri = '/api/todo'

describe('todo-route POST', function() {
  let token = undefined

  before(async function() {
    token = await getToken()
  })

  describe('test POST /api/todo', function() {
    before(async function() {
      await dropCollection(collectionName)
    })

    it('should post 1 todo', async function() {
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 200,
        body: goodTodo,
        token
      })
      const data = r.body[0]
      expect(data.title).to.equal(goodTodo.title)
      expect(data.completed).to.equal(false)
      expect(data.email).to.equal(goodTodo.email)
    })

    it('should fail validation - missing email', async function() {
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 422,
        body: missingEmailTodo,
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(invalidEmailMsg)
    })

    it('should fail validation - invalid email missing tld', async function() {
      const r = await sendRequest({
        method: 'POST', 
        uri: postUri,
        status: 422,
        body: invalidEmailTodo01, 
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(invalidEmailMsg)
    })
    it('should fail validation - invalid email missing @', async function() {
      const r = await sendRequest({
        method: 'POST',
        uri: postUri,
        status: 422,
        body: invalidEmailTodo02,
        token
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(invalidEmailMsg)
    })
    it('should fail validation - missing title', async function() {
      const r = await sendRequest({
        method: 'POST', 
        uri: postUri,
        status: 422,
        body: missingTitleTodo,
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
        body: titleTooShortTodo,
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
        body: emptyTitleTodo,
        token})
      const { errors } = r.body
      expect(errors[0].msg).to.equal(titleTooShortMsg)
    })
  })
})
