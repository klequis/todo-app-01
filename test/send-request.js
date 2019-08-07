import app from 'server'
import request from 'supertest'
import { green } from 'logger'
const sendRequest = async (body, status, token) => {
  // green('token', token)
  const r = await request(app)
    .post('/api/todo')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token.access_token}`)
    .send(body)
    .expect('Content-Type', /json/)
    .expect(status)
  // green('r', r.body)
  return r
}

export default sendRequest