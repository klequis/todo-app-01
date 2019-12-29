import { expect } from 'chai'
import getToken from 'test/getToken'
import { dropCollection, insertMany } from 'db'
import { fourTodos } from 'test/fourTodos'
import sendRequest from 'test/sendRequest'
import { TODO_COLLECTION_NAME } from 'db/constants'
import config from 'config'

const cfg = config()
// TODO: should this be using 'user_id' and not 'uuid'
// const auth0UUID = cfg.testUser.auth0UUID
const testUserUUID = cfg.testUser.uuid

describe('test getToken()', function() {
  let token

  before(async function() {
    token = await getToken()
    await dropCollection(TODO_COLLECTION_NAME)
    await insertMany(TODO_COLLECTION_NAME, fourTodos)
  })

  it('should have keys: access_token, expires_in, token_type ', function() {
    const keys = Object.keys(token)
    console.log(keys)

    expect(keys.includes('access_token')).to.equal(true)
    expect(keys.includes('expires_in')).to.equal(true)
    expect(keys.includes('token_type')).to.equal(true)
  })

  it('should return 4 todos', async function() {
    const r = await sendRequest({
      method: 'GET',
      uri: `/api/todo/${testUserUUID}`,
      status: 200,
      token
    })
    const data = r.body
    expect(data.length).to.equal(4)
  })
})
