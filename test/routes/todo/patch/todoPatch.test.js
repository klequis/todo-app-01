import { expect } from 'chai'
import { testUserUUID } from './fixture'
import { fourTodos } from 'test/fourTodos'
import { dropCollection, insertMany } from 'db'
import getToken from 'test/getToken'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'db/constants'
import { mergeRight } from 'ramda'
import { isDateTimeAfter, findObjectInArray } from 'lib'
import { addDays, differenceInDays } from 'date-fns'
import { redf } from 'logger'

function patchUri(id) {
  return `/api/todo/${testUserUUID}/${id}`
}

describe('todoRoute PATCH', function() {
  let token = undefined
  before(async function() {
    token = await getToken()
  })
  describe('test PATCH /api/todo/:id', function() {
    let idToUpdate1
    before(async function() {
      await dropCollection(TODO_COLLECTION_NAME)
      const inserted = await insertMany(TODO_COLLECTION_NAME, fourTodos)
      idToUpdate1 = inserted[1]._id.toString()
    })
    it('all fields valid - should return document with updated title, completed & lastUpdateAt', async function() {
      // use fourTodos[1]
      const todo = fourTodos[1]
      const originalDueDate = todo.dueDate
      const originalDueDatePlus1Day = addDays(
        new Date(originalDueDate),
        1
      ).toISOString()
      const todoSent = mergeRight(todo, {
        _id: idToUpdate1,
        title: 'changed title',
        completed: true,
        dueDate: originalDueDatePlus1Day
      })
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri(todoSent._id),
        status: 200,
        body: todoSent,
        token
      })
      const { body } = r
      // length
      expect(body.length).to.equal(1)
      const todoReturned = body[0]
      // _id
      expect(todoReturned._id).to.equal(idToUpdate1)
      // completed
      expect(todoReturned.completed).to.equal(todoSent.completed)
      // createdAt
      expect(todoReturned.createdAt).to.equal(todoSent.createdAt)
      // dueDate
      const dayDiff = differenceInDays(todoReturned.dueDate, originalDueDate)
      expect(dayDiff).to.equal(1)
      // lastUpdatedAt - won't match exact
      // just check that it is after
      const origDate = todoSent.lastUpdatedAt
      const modDate = todoReturned.lastUpdatedAt
      const after = isDateTimeAfter(origDate, modDate)
      expect(after).to.equal(true)
      // Title
      expect(todoReturned.title).to.equal(todoSent.title)
      // userId
      expect(todoReturned.userId).to.equal(todoSent.userId)
    })

    it('invalid _id, invalid userId, all others missing', async function() {
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri(),
        status: 422,
        body: {
          _id: '123',
          userId: '123',
          title: 'This title is more than 30 characters long.'
        },
        token
      })
      const { body } = r

      const { errors } = body
      expect(errors.length).to.equal(8)
      // check all expected errors are returned
      const errorFields = [
        '_id',
        'todoid',
        'completed',
        'createdAt',
        'lastUpdatedAt'
      ]
      errorFields.forEach(field => {
        const o = findObjectInArray(errors, 'param', field)
        // Log out any fields that are missing
        if (typeof o === 'undefined') {
          console.group()
          console.log()
          redf(`field ${field} is undefined`)
          console.log()
        }
        expect(typeof o).to.equal('object')
      })
    })
  })
})
