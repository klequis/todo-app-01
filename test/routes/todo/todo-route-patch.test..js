import { expect } from 'chai'
import { fourTodosForPost } from './fixture'
import { dropCollection, insertMany } from 'db'
import getToken from 'test/get-token'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { mergeRight } from 'ramda'
import { yellow } from 'logger'
import { isDateTimeAfter } from 'lib'

function patchUri(id) {
  return `/api/todo/${id}`
}

describe.only('todo-route PATCH', function() {
  let token = undefined
  yellow('4todos', fourTodosForPost)
  before(async function() {
    token = await getToken()
  })
  describe('test PATCH /api/todo/:id', function() {
    let idToUpdate1
    let idToUpdate2
    before(async function() {
      await dropCollection(TODO_COLLECTION_NAME)
      const inserted = await insertMany(TODO_COLLECTION_NAME, fourTodosForPost)
      idToUpdate1 = inserted[1]._id.toString()
      idToUpdate2 = inserted[2]._id.toString()
    })
    it.only('all fields valid - should return document with updated title, completed & lastUpdateAt', async function() {
      // use fourTodosForPost[1]
      const originalTodo = fourTodosForPost[1]
      const newData = mergeRight(originalTodo, {
        _id: idToUpdate1,
        title: 'changed title',
        completed: true
      })
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri(newData._id),
        status: 200,
        body: newData,
        token
      })
      const { body } = r
      expect(body.length).to.equal(1)
      const modifiedTodo = body[0]
      expect(modifiedTodo._id).to.equal(idToUpdate1)
      expect(modifiedTodo.completed).to.equal(true)

      // yellow('todo.lastUpdatedAt', modifiedTodo.lastUpdatedAt)

      const origDate = fourTodosForPost[1].lastUpdatedAt
      yellow('origDate', origDate)
      const modDate = modifiedTodo.lastUpdatedAt
      yellow('modDate', modDate)
      // isAfter - is the first date after the second date


      // origDate  2019-08-12T17:01:16.927Z
      //  modDate  2019-08-12T22:26:28.378Z

      const after = isDateTimeAfter(origDate, modDate)
      expect(after).to.equal(true)
      expect(modifiedTodo.title).to.equal(newData.title)
    })

    it('should return document with updated title only', async function() {
      const newData = { _id: idToUpdate2, title: 'another changed title' }
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri(newData._id),
        status: 200,
        body: newData,
        token
      })
      const { body } = r
      expect(body.length).to.equal(1)
      expect(body[0].title).to.equal(newData.title)
      expect(body[0]._id).to.equal(newData._id)
      expect(body[0].completed).to.equal(false)
    })
  })
})
