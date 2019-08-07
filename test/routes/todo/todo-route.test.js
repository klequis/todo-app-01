import { expect } from 'chai'
import sendRequest from 'test/sendRequest'
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
    it('NEW: should return 400 & unknown endpoint', async () => {
      const r = await sendRequest({
        method: 'GET',
        uri: '/api/unknown',
        status: 400,
        token,
      })
    })
  })
})
