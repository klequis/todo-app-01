import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  close,
  dropCollection,
  find,
} from 'db'

import { yellow } from 'logger'

const collectionName = 'todos'

describe.only('todo-route POST', function() {
  describe('test POST /api/todo', function() {
    before(async function() {
      await dropCollection(collectionName)
    })
    it('should post 1 todo', async function() {
      const post = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send(oneTodo)
        .expect('Content-Type', /json/)
        .expect(200)
      const data = post.body.data[0]
      expect(data.title).to.equal(oneTodo.title)
      expect(data.completed).to.equal(false)

      // Confirm using find(). Remember, find() will return an array
      const findRes = await find(collectionName, {})
      const findData = findRes.data
      expect(findData[0].title).to.equal(oneTodo.title)
      expect(findData[0].completed).to.equal(false)
    })
  })

  describe('test validation for POST /api/todo', function() {
    it('send it nothing at all', async function() {
      const ret = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send()
      expect(ret.body.error.errorCount).to.equal(1)
      expect(ret.body.error.errors[0].inputError).to.equal(
        'parameter obj is invalid type [object Object]'
      )
    })
    it('send "" ', async function() {
      const ret = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send('')
      expect(ret.body.error.errorCount).to.equal(1)
      expect(ret.body.error.errors[0].inputError).to.equal(
        'parameter obj is invalid type [object Object]'
      )
    })
    it('send "a" ', async function() {
      const ret = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send('a')
      expect(ret.body.error.errorCount).to.equal(1)
      expect(ret.body.error.errors[0].inputError).to.equal(
        'parameter obj is invalid type [object Object]'
      )
    })
    it('send {}', async function() {
      const ret = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send({})
      expect(ret.body.error.errorCount).to.equal(1)
      expect(ret.body.error.errors[0].inputError).to.equal(
        'parameter obj is invalid type [object Object]'
      )
    })
    it('send too short title', async function() {
      const ret = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send({ title: 'a' })
      // expect(ret.body.error.errors[0].title).to.equal(
      //   'Incorrect length. Should be >= 3'
      // )
    })
    it('send title = 123', async function() {
      const ret = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send({ title: 123 })
      expect(ret.body.data.title).to.equal(123)
    })
    it('send title = "123" ', async function() {
      const ret = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send({ title: '123' })
      expect(ret.body.data.title).to.equal('123')
    })
  })
})