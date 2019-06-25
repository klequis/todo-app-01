import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  dropCollection,
  insertMany,
} from 'db'

import { green } from 'logger'

const collectionName = 'todos'

describe('todo-route GET', function() {
  describe('test GET /api/todo', function() {
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
    })
    it('should return 4 todos', async function() {
      const get = await request(app)
        .get('/api/todo')
        .set('Accept', 'application/json')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
      const data = get.body
      expect(data.length).to.equal(4)
    })
  })

  describe('test GET /api/todo/:id', function() {
    let _idToGet = ''
    before(async function() {
      await dropCollection(collectionName)
      const insert = await insertMany(collectionName, fourTodos)
      // green('insert', insert)
      _idToGet = insert[1]._id.toString()
      // green('_idToGet', _idToGet)
    })
    it('should get todo with specified _id', async function() {
      const get = await request(app)
        .get(`/api/todo/${_idToGet}`)
        .set('Accept', 'application/json')
        .send()
      // expect(get.body.data[0]._id.toString()).to.equal(_idToGet)
    })
  })
})
