import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  dropCollection,
  find,
  insertMany,
} from 'db'

import { yellow } from 'logger'

const collectionName = 'todos'

describe('todo-route DELETE', function() {
  describe('test DELETE /api/todo/:id', function() {
    let _idToDelete = ''
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
      const findRes = await find(collectionName, {})
      expect(findRes.data.length).to.equal(4)
      const _id = findRes.data[1]._id // returns object
      // The _ids returned by find() are objects. However, in use
      // _ids will come from the client and will always be strings
      // Therefore, convert to string
      _idToDelete = _id.toHexString()
    })
    it('should delete one record', async function() {
      const delRes = await request(app)
        .delete(`/api/todo/${_idToDelete}`)
        .set('Accept', 'application/json')
        .send()
        .expect(200)
    })
    it.skip('should return invalid _id', async function() {
      const delRes = await request(app)
        // .delete(`/api/todo/${_idToDelete}`)
        .delete(`/api/todo/'5d0147d82bdf2864'`)
        .set('Accept', 'application/json')
        .send()
        .expect(400)
      // yellow('delRes.status', delRes.status)
      // yellow('delRes.body', delRes.body)
    })
  })
})
