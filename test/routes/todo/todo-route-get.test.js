import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  dropCollection,
  insertMany,
} from 'db'
import getToken from 'test/get-token'

const collectionName = 'todos'

const invalidMongoIdMsg = 'Parameter id must be a valid MongodDB hex string.'
const invalidMongoId = '5d0147d82bdf2864' // this id is truncated

describe('todo-route GET', function() {

  let token = undefined

  before(async function() {
    token = await getToken()
  })

  describe('test GET /api/todo', function() {
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
    })
    it('should return 4 todos', async function() {
      const r = await request(app)
        .get('/api/todo')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
      expect(r.body.length).to.equal(4)
    })
  })

  describe('test GET /api/todo/:id', function() {
    let _idToGet = ''
    before(async function() {
      await dropCollection(collectionName)
      const r = await insertMany(collectionName, fourTodos)
      _idToGet = r[1]._id.toString()
    })
    it('should get todo with specified _id', async function() {
      const r = await request(app)
        .get(`/api/todo/${_idToGet}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send()
      expect(r.body[0]._id.toString()).to.equal(_idToGet)
    })
    it('should get todo with specified _id', async function() {
      const r = await request(app)
        .get(`/api/todo/${invalidMongoId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send()
        .expect(422)
      const { errors } = r.body
      expect(errors[0].msg).to.equal(invalidMongoIdMsg)
    })
  })

})
