import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  close,
} from 'db'

import { yellow } from 'logger'
import getToken from 'test/get-token'

const collectionName = 'todos'

after(async () => {
  await close()
})

describe.only('todo-route', function() {
  let token
  before(async function() {
    token = await getToken()
  })
  describe('unknown endpoint', function() {
    it('should return 404 & unknown endpoint', async () => {
      const r = await request(app)
        .get('/api/unknown')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token.access_token}`)
        .send()
      expect(404)
      yellow('statusCode', r.statusCode)
      yellow('statusMessage', r.statusMessage)
      yellow('text', r.text)
      // expect(get.statusMessage).to.equal('Not Found')
      
      // expect(get.text).to.equal('Unknown endpoint')
    })
  })
})
