import { expect } from 'chai'
import request from 'supertest'
import app from 'server'
import {
  close,
} from 'db'

import getToken from 'test/get-token'

after(async () => {
  await close()
})

describe('todo-route', function() {
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
    })
  })
})
