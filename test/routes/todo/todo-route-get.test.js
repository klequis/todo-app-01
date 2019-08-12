import { expect } from 'chai'
import { fourTodos } from './fixture'
import {
  dropCollection,
  insertMany,
} from 'db'
import getToken from 'test/get-token'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'routes/constants'

const invalidMongoIdMsg = 'Parameter id must be a valid MongodDB hex string.'
const invalidMongoId = '5d0147d82bdf2864' // this id is truncated

const getUri = (value) => `/api/todo/${value || ''}`


describe('todo-route GET', function() {

  let token = undefined

  before(async function() {
    token = await getToken()
  })

  describe('test GET /api/todo', function() {
    before(async function() {
      await dropCollection(TODO_COLLECTION_NAME)
      await insertMany(TODO_COLLECTION_NAME, fourTodos)
    })
    it('should return 4 todos', async function() {
      const r = await sendRequest({
        method: 'GET',
        uri: getUri(),
        status: 200,
        token,

      })
      expect(r.body.length).to.equal(4)
    })
  })

  describe('test GET /api/todo/:id', function() {
    let _idToGet = ''
    before(async function() {
      await dropCollection(TODO_COLLECTION_NAME)
      const r = await insertMany(TODO_COLLECTION_NAME, fourTodos)
      _idToGet = r[1]._id.toString()
    })
    it('should get todo with specified _id', async function() {
      const r = await sendRequest({
        method: 'GET',
        uri: getUri(_idToGet),
        status: 200,
        token,
      })
      expect(r.body[0]._id.toString()).to.equal(_idToGet)
    })
    it('should get todo with specified _id', async function() {
      const r = await sendRequest({
        method: 'GET',
        uri: getUri(invalidMongoId),
        status: 422,
        token,
      })
      const { errors } = r.body
      expect(errors[0].msg).to.equal(invalidMongoIdMsg)
    })
  })

})
