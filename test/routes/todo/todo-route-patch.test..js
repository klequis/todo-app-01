import { expect } from 'chai'
import { fourTodos, oneTodo } from './fixture'
import { dropCollection, insertMany } from 'db'
import getToken from 'test/get-token'
import sendRequest from 'test/sendRequest'

const collectionName = 'todos'
const patchUri = `/api/todo`

describe('todo-route', function() {
  let token = undefined

  before(async function() {
    token = await getToken()
  })
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
      const newData = {
        _id: idToUpdate1,
        title: 'changed title',
        completed: true
      }
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri,
        status: 200,
        body: newData,
        token,
      })
      const data = r.body[0]
      expect(data.title).to.equal(newData.title)
      expect(data.completed).to.equal(true)
    })

    it('should return document with updated title only', async function() {
      const newData = { _id: idToUpdate2, title: 'another changed title' }
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri,
        status: 200,
        body: newData,
        token,
      })
      const { body } = r
      expect(body.length).to.equal(1)
      expect(body[0].title).to.equal(newData.title)
      expect(body[0]._id).to.equal(newData._id)
      expect(body[0].completed).to.equal(false)
    })
  })
})
