import sendRequest from 'test/sendRequest'
import { close } from 'db'
import getToken from 'test/getToken'

after(async () => {
  await close()
})

describe('todoRoute', function() {
  let token
  before(async function() {
    token = await getToken()
  })
  describe('unknown endpoint', function() {
    it('should return 400 & unknown endpoint', async () => {
      const r = await sendRequest({
        method: 'GET',
        uri: '/api/unknown',
        status: 400,
        token
      })
    })
  })
})
