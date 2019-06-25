import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  dropCollection,
  insertMany,
} from 'db'

// eslint-disable-next-line
import { logResponse, yellow } from 'logger'

const collectionName = 'todos'


describe('todo-route', function() {
  describe('test PATCH /api/todo/:id', function() {
    let idToUpdate1
    let idToUpdate2
    before(async function() {
      await dropCollection(collectionName)
      const inserted = await insertMany(collectionName, fourTodos)
      idToUpdate1 = inserted[1]._id.toString()
      idToUpdate2 = inserted[2]._id.toString()
    })
    it('update title and completed should return document with updated title & completed', async function() {
      const newData = { _id: idToUpdate1, title: 'changed title', completed: true }

      const r = await request(app)
        .patch(`/api/todo`)
        .set('Accept', 'application/json')
        .send(newData)
      const data = r.body[0]
      expect(data.title).to.equal(newData.title)
      expect(data.completed).to.equal(true)
    })
    it('update title and and send with _id should return document with update title', async function() {
      const newData = { _id: idToUpdate2, title: 'changed title' }
      const r = await request(app)
        .patch(`/api/todo`)
        .set('Accept', 'application/json')
        .send(newData)
      const data = r.body[0]
      expect(data.title).to.equal(newData.title)
      expect(data.completed).to.equal(false)
    })
  })
})


/*
.headers.text
.request.Test.url
.request.Test.url
._data
.req.ClientRequest.method
.req.ClientRequest.path
res.IncomingMessage.statusCode
res.IncomingMessage.statusMessage
res.IncomingMessage.text
.text
.body
.headers
.status
.ok
.clientError
.serverError
.error
.type
.charset
*/