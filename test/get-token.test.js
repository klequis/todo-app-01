import request from 'supertest'
import { expect } from 'chai'
import getToken from './get-token'
import app from 'server'
import { dropCollection, insertMany } from 'db'
import { fourTodos } from './routes/todo/fixture'

const collectionName = 'todos'

describe('test getToken()', function() {
  let token
  before(async function() {
    token = await getToken()
    await dropCollection(collectionName)
    await insertMany(collectionName, fourTodos)
    // console.log('token', token)
  })
  it('should have keys: access_token, expires_in, token_type ', function() {
    const keys = Object.keys(token)
    console.log(keys)

    expect(keys.includes('access_token')).to.equal(true)
    expect(keys.includes('expires_in')).to.equal(true)
    expect(keys.includes('token_type')).to.equal(true)

  })

  it('should return 4 todos', async function() {
    const get = await request(app)
      .get('/api/todo')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.access_token}`)
      
      .send()
      .expect('Content-Type', /json/)
      .expect(200)
    const data = get.body
    expect(data.length).to.equal(4)
  })


})

