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

  // ** can't run test when not in test
  // dev
  // testRemote - no tests
  // prod - no tests
})