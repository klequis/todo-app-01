import { expect } from 'chai'
import { fourTodos } from 'test/fourTodos'
import { dropCollection, find, insertMany } from 'db'
import getToken from 'test/getToken'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'db/constants'
import config from 'config'

// const invalidMongoIdMsg = 'Parameter id must be a valid MongodDB hex string.'
const invalidMongoId = '5d0147d82bdf2864' // this id is truncated
const idNotFound = '5cfbe5bf4bc4b4f726a14852' // this is a valid id but not in the db

const cfg = config()
const testUserUUID = cfg.testUser.uuid

const deleteUri = todoid => {
  const uri = `/api/todo/${testUserUUID}/${todoid}`
  return uri
}

describe('test DELETE /api/todo/:userid/:todoid', function() {
  let _idToDelete = ''
  let token = undefined

  before(async function() {
    token = await getToken()

    await dropCollection(TODO_COLLECTION_NAME)
    await insertMany(TODO_COLLECTION_NAME, fourTodos)
    const r = await find(TODO_COLLECTION_NAME, {})
    expect(r.length).to.equal(4)
    const _id = r[1]._id // returns object
    // The _ids returned by find() are objects. However, in actual use
    // _ids will come from the client and will always be strings
    // Therefore, convert to string
    _idToDelete = _id.toHexString()
  })

  it('should delete one record', async function() {
    const r = await sendRequest({
      method: 'DELETE',
      uri: deleteUri(_idToDelete),
      status: 200,
      body: {},
      token
    })
    const { body } = r
    expect(body[0].title).to.equal(fourTodos[1].title)
    expect(body[0].completed).to.equal(false)
  })

  it('should return invalid todoid', async function() {
    const r = await sendRequest({
      method: 'DELETE',
      uri: deleteUri(invalidMongoId),
      status: 422,
      token
    })
    const { errors } = r.body
    expect(errors[0].msg).to.equal('003: param todoid is not valid')
  })

  it('should return id not found', async function() {
    const r = await sendRequest({
      method: 'DELETE',
      uri: deleteUri(idNotFound),
      status: 404,
      token
    })
    const { body } = r
  })
})
