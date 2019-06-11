import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  dropCollection,
  insertMany,
} from 'db'

const collectionName = 'todos'

describe('todo-route', function() {
  describe('test PATCH /api/todo/:id', function() {
    const newData = { title: 'changed title', completed: true }
    let idToUpdate
    before(async function() {
      await dropCollection(collectionName)
      const inserted = await insertMany(collectionName, fourTodos)
      idToUpdate = inserted.data[1]._id.toString()
    })
    it('should return document document with updated title', async function() {
      const updateRes = await request(app)
        .patch(`/api/todo/${idToUpdate}`)
        .set('Accept', 'application/json')
        .send(newData)
      const data = updateRes.body.data
      expect(data.title).to.equal(newData.title)
      expect(data.completed).to.equal(true)
    })
  })

})
