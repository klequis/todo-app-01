import { expect } from 'chai'
import { mongoUri, dbName, apiRoot } from 'config'

describe('test config', function() {
  const testLocal = 'testLocal'
  const dev = 'dev'
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
  // dev
  it('test mongoUri(dev) - should return true', function() {
    const mongoUriRegEx = /mongodb:\/\/devUser:.*@localhost:27017\/todo-dev/g
    expect(mongoUriRegEx.test(mongoUri(dev))).to.equal(true)
  })
  it('test dbName(dev)', function() {
    expect(dbName(dev)).to.equal('todo-dev')
  })
  it('test apiRoot(dev)', function() {
    expect(apiRoot(dev)).to.equal('https://api.klequis-todo.tk')
  })
  // testRemote - no tests
  // prod - no tests
})