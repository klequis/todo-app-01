import { expect } from 'chai'
import request from 'supertest'
import { fourTodos, oneTodo } from './fixture'
import app from 'server'
import {
  close,
} from 'db'

import { yellow } from 'logger'

const collectionName = 'todos'

after(async () => {
  await close()
})

describe('todo-route', function() {
  describe('unknown endpoint', function() {
    it('should return 404 & unknown endpoint', async () => {
      const get = await request(app)
        .get('/api/unknown')
        .set('Accept', 'application/json')
        .send()
      expect(404)
      expect(get.text).to.equal('Unknown endpoint')
    })
  })
})
