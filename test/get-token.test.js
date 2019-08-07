import { expect } from 'chai'
import getToken from './get-token'
import { dropCollection, insertMany } from 'db'
import { fourTodos } from './routes/todo/fixture'
import sendRequest from 'test/sendRequest'

const collectionName = 'todos'

describe('test getToken()', function() {
  let token

  before(async function() {
    token = await getToken()
    await dropCollection(collectionName)
    await insertMany(collectionName, fourTodos)
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
      uri: '/api/todo',
      status: 200,
      token
    })
    const data = r.body
    expect(data.length).to.equal(4)
  })
})
