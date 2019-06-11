import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  dropCollection,
  find,
  insertMany,
} from 'db'

const collectionName = 'todos'

describe('todo-route DELETE', function() {
  describe('test DELETE /api/todo/:id', function() {
    let _idToDelete = ''
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
      const findRes = await find(collectionName, {})
      expect(findRes.data.length).to.equal(4)
      _idToDelete = findRes.data[1]._id
    })
    it('should delete one record', async function() {
      const delRes = await request(app)
        .delete(`/api/todo/${_idToDelete}`)
        .set('Accept', 'application/json')
        .send()
        .expect(200)
      const delData = delRes.body.data
      expect(delData._id).to.equal(_idToDelete.toHexString())
    })
  })
})
