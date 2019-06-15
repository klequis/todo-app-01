import { hasProp, isValidMongoStringId } from 'lib'

import { expect } from 'chai'

import { yellow } from 'logger'


const validHexString = '5ce819935e539c343f141ece'

describe('test lib', function() {
  describe('test hasProp', function() {
    it('should return false', function() {
      const ret = hasProp('title', {})
      expect(ret).to.equal(false)
    })
    it('should return true', function() {
      const ret = hasProp('title', { title: 'hello' })
      expect(ret).to.equal(true)
    })
  })
  describe('test getObjectId', function() {
    it('valid hex id should return true', function() {
      expect(isValidMongoStringId(validHexString)).to.equal(true)
    })
    it('number should return false', function() {
      expect(isValidMongoStringId(123)).to.equal(false)
    })
    it('string should return false', function() {
      expect(isValidMongoStringId('astringof12c')).to.equal(false)
      expect(isValidMongoStringId('astringof24castringof24c')).to.equal(false)
    })
  })
})
