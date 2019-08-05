import { expect } from 'chai'
import request from 'supertest'
import { equals } from 'ramda'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import { close, dropCollection, find } from 'db'
import getToken from 'test/get-token'

// eslint-disable-next-line
import { logResponse, yellow } from 'logger'

const collectionName = 'todos'

const titleTypeErr = {
  location: 'body',
  param: 'title',
  msg: 'Title must be a string.'
}

const titleLenErr = {
  location: 'body',
  param: 'title',
  msg: 'Title must be at least 3 characters long.'
}

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
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send(oneTodo)
        .expect('Content-Type', /json/)
        .expect(200)
      const data = r.body[0]
      expect(data.title).to.equal(oneTodo.title)
      expect(data.completed).to.equal(false)
    })
  })

  describe('test validation for POST /api/todo', function() {
    it('send it nothing at all', async function() {
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send()
      const { errors } = r.body
      expect(errors.length).to.equal(2)
      expect(equals(errors[0], titleTypeErr)).to.equal(true)
      expect(equals(errors[1], titleLenErr)).to.equal(true)
    })
    it('send "" ', async function() {
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send('')
      const { errors } = r.body
      expect(errors.length).to.equal(2)
      expect(equals(errors[0], titleTypeErr)).to.equal(true)
      expect(equals(errors[1], titleLenErr)).to.equal(true)
    })
    it('send "a" ', async function() {
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send('a')
      const { errors } = r.body
      expect(errors.length).to.equal(2)
      expect(equals(errors[0], titleTypeErr)).to.equal(true)
      expect(equals(errors[1], titleLenErr)).to.equal(true)
    })
    it('send {}', async function() {
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send({})
      const { errors } = r.body
      expect(errors.length).to.equal(2)
      expect(equals(errors[0], titleTypeErr)).to.equal(true)
      expect(equals(errors[1], titleLenErr)).to.equal(true)
    })
    it('send too short title', async function() {
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send({ title: 'a' })
      const { errors } = r.body
      expect(errors.length).to.equal(1)
      expect(errors[0].msg).to.equal(titleLenErr.msg)
    })
    it('send title = 123', async function() {
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send({ title: 123 })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(titleTypeErr.msg)
    })
    it('send title = "123" ', async function() {
      const r = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send({ title: '123' })
      const { body } = r
      const data = body[0]
      expect(data.title).to.equal('123')
    })
  })
})
