import { hasProp } from 'lib'

import { expect } from 'chai'

import { yellow } from 'logger'

describe('test lib', function () {
  it('should return false', function() {
    const ret = hasProp('title', {})
    expect(ret).to.equal(false)
  })
  it('should return true', function() {
    const ret = hasProp('title', { title: 'hello' })
    expect(ret).to.equal(true)
  })
  
})