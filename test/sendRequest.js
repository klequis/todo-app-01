import app from 'server'
import request from 'supertest'
import { green } from 'logger'
import { yellow } from '../logger';

const invalidMethodErrMsg = receivedMethod => {
  return `'method' must be one of ['post', 'delete', 'get', 'patch']. Received ${receivedMethod}`
}

const sendRequest = async ({ method = '', uri = '', status, body, token }) => {
  green('method', method)
  green('uri', uri)
  green('status', status)
  green('body', body)
  green('token', token)

  const methodToLower = method.toLowerCase()

  const validMethod = ['post', 'delete', 'get', 'patch'].includes(methodToLower)
  green('valid method', validMethod)
  if (!validMethod) {
    throw new Error(invalidMethodErrMsg(method))
  }

  if (status === undefined || typeof status !== 'number') {
    throw new Error(`'status' must be a number`)
  }

  if (methodToLower === 'post') {
    const r = await request(app)
      .post(uri)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(body)
      .expect(status)
      .expect('Content-Type', /json/)
    return r
  }

  if (methodToLower === 'delete') {
    const r = await request(app)
      .delete(uri)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send()
      .expect(status)
      .expect('Content-Type', /json/)
    return r
  }

  if (methodToLower === 'get') {
    const r = await request(app)
      .get(uri)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send()
      .expect(status)
      .expect('Content-Type', /json/)
    return r
  }

  if (methodToLower === 'patch') {
    const r = await request(app)
      .patch(uri)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(body)
      .expect(status)
      .expect('Content-Type', /json/)
    return r
  }
}

export default sendRequest
