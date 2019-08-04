import { expect } from 'chai'
import { mongoUri, dbName, apiRoot } from 'config'
import { yellow } from 'logger'

describe('test config', function() {
  const testLocal = 'testLocal'
  const development = 'development'
  // testLocal
  it('test mongoUri(testLocal) - should return true', function() {
    const mongoUriRegEx = /mongodb:\/\/testUser:.*@localhost:27017\/todo-test/g
    expect(mongoUriRegEx.test(mongoUri(testLocal))).to.equal(true)
  })
  it('test dbName(testLocal)', function() {
    expect(dbName(testLocal)).to.equal('todo-test')
  })
  it('test apiRoot(testLocal)', function() {
    expect(apiRoot(testLocal)).to.equal('https://api.klequis-todo.tk')
  })
  // development
  it('test mongoUri(development) - should return true', function() {
    const mongoUriRegEx = /mongodb:\/\/devUser:.*@localhost:27017\/todo-dev/g
    expect(mongoUriRegEx.test(mongoUri(development))).to.equal(true)
  })
  it('test dbName(development)', function() {
    expect(dbName(development)).to.equal('todo-dev')
  })
  it('test apiRoot(development)', function() {
    expect(apiRoot(development)).to.equal('https://api.klequis-todo.tk')
  })
  // testRemote - no tests
  // prod - no tests
})
