import { expect } from 'chai'
import { fourTodos, auth0UUID } from './fixture'
import { dropCollection, insertMany } from 'db'
import getToken from 'test/getToken'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'routes/constants'
import { mergeRight } from 'ramda'
import { yellow } from 'logger'
import { isDateTimeAfter, findObjectInArray } from 'lib'
import {
  completedCheck,
  createdAtCheck,
  dueDateCheck,
  lastUpdatedAtCheck,
  mongoIdInBodyCheck,
  mongoIdParamsCheck,
  titleLengthCheck,
  userIdInBodyCheck,
} from 'routes/todoRoute/validationChecks'

function patchUri(id) {
  return `/api/todo/${auth0UUID}/${id}`
}

describe.only('todoRoute PATCH', function() {
  let token = undefined
  before(async function() {
    token = await getToken()
  })
  describe('test PATCH /api/todo/:id', function() {
    let idToUpdate1
    let idToUpdate2
    before(async function() {
      await dropCollection(TODO_COLLECTION_NAME)
      const inserted = await insertMany(TODO_COLLECTION_NAME, fourTodos)
      idToUpdate1 = inserted[1]._id.toString()
      idToUpdate2 = inserted[2]._id.toString()
    })
    it('all fields valid - should return document with updated title, completed & lastUpdateAt', async function() {
      // use fourTodos[1]
      const originalTodo = fourTodos[1]
      const newData = mergeRight(originalTodo, {
        _id: idToUpdate1,
        title: 'changed title',
        completed: true
      })
      // yellow('newData', newData)
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri(newData._id),
        status: 200,
        body: newData,
        token
      })
      const { body } = r
      // length
      expect(body.length).to.equal(1)
      const modifiedTodo = body[0]
      // _id
      expect(modifiedTodo._id).to.equal(idToUpdate1)
      // completed
      expect(modifiedTodo.completed).to.equal(true)
      // dueDate
      expect(modifiedTodo.dueDate).to.equal(undefined)
      // lastUpdatedAt
      const origDate = fourTodos[1].lastUpdatedAt
      const modDate = modifiedTodo.lastUpdatedAt
      const after = isDateTimeAfter(origDate, modDate)
      expect(after).to.equal(true)
      // Title
      expect(modifiedTodo.title).to.equal(newData.title)
      // userId
      expect(modifiedTodo.userId).to.equal(newData.userId)
    })

    it.only('check field validation error messages - missing', async function() {
      const r = await sendRequest({
        method: 'PATCH',
        uri: patchUri(),
        status: 422,
        body: { 
          _id: '123',
          userId: '123' 
        },
        token
      })
      const { body } = r

      const { errors } = body
      yellow('errors', errors)
      // // length
      // // expect(errors.length).to.equal(7)
      // // _id
      // expect(findObjectInArray(errors, 'param', '_id').msg).to.equal(
      //   mongoIdInBodyCheck.errorMessage
      // )
      // // completed
      // expect(findObjectInArray(errors, 'param', 'completed').msg).to.equal(
      //   completedCheck.errorMessage
      // )
      // // createdAt
      // expect(
      //   findObjectInArray(errors, 'param', 'createdAt').msg
      // ).to.equal(createdAtCheck.errorMessage)
      // // dueDate - is optional so no error will be found
      // expect(findObjectInArray(errors, 'param', 'dueDate')).to.equal(undefined)
      // // lastUpdatedAt
      // expect(findObjectInArray(errors, 'param', 'lastUpdatedAt').msg).to.equal(
      //   lastUpdatedAtCheck.errorMessage
      // )
      // // title
      // expect(findObjectInArray(errors, 'param', 'title').msg).to.equal(
      //   titleLengthCheck.errorMessage
      // )
      // // userId
      // expect(findObjectInArray(errors, 'param', 'userId').msg).to.equal(
      //   userIdInBodyCheck.errorMessage
      // )
    })
  })
})
