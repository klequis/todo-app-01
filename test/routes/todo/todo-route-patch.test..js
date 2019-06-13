import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  dropCollection,
  insertMany,
} from 'db'

import { yellow } from 'logger'

const collectionName = 'todos'

describe('todo-route', function() {
  describe('test PATCH /api/todo/:id', function() {
    let idToUpdate1
    let idToUpdate2
    before(async function() {
      await dropCollection(collectionName)
      const inserted = await insertMany(collectionName, fourTodos)
      idToUpdate1 = inserted.data[1]._id.toString()
      idToUpdate2 = inserted.data[2]._id.toString()
    })
    it('update title and completed should return document with updated title & completed', async function() {
      const newData = { title: 'changed title', completed: true }
      const updateRes = await request(app)
        .patch(`/api/todo/${idToUpdate1}`)
        .set('Accept', 'application/json')
        .send(newData)
      const data = updateRes.body.data[0]
      expect(data.title).to.equal(newData.title)
      expect(data.completed).to.equal(true)
    })
    it('update title and and send with _id should return document with update title', async function() {
      const newData = { _id: idToUpdate2, title: 'changed title' }
      const updateRes = await request(app)
        .patch(`/api/todo/${idToUpdate2}`)
        .set('Accept', 'application/json')
        .send(newData)
      const data = updateRes.body.data[0]
      yellow('data', data)
      expect(data.title).to.equal(newData.title)
      expect(data.completed).to.equal(false)
    })
  })

})
