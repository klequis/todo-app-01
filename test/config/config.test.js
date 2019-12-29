import { expect } from 'chai'
import { TEST_LOCAL, TEST_REMOTE, DEV, PROD } from 'config'
import config from 'config'
import settings from '../../config/config.settings'

const environments = [TEST_LOCAL, TEST_REMOTE, DEV, PROD]

describe('test config', function() {
  const startNodeEnv = process.env.NODE_ENV
  after(function() {
    config(startNodeEnv)
  })
  environments.forEach(env => {
    let cfg
    before(function() {
      cfg = config(env)
    })

    describe(`test config for ${env}`, function() {
      // apiRoot
      it('should return apiRoot', function() {
        if (env in [TEST_LOCAL, DEV, TEST_LOCAL]) {
          expect(cfg.apiRoot).to.equal(settings.apiRoot.local)
        }
        if (env === PROD) {
          expect(cfg.apiRoot).to.equal(settings.apiRoot.remote)
        }
      })

      // number of keys
      it('should return 7 keys', function() {
        // decided to only do this test to auth0 data to keep
        // data concealed.
        // Isn't env dependent but should be the same in each environment
        expect(Object.keys(cfg.auth0).length).to.equal(7)
      })

      // test 'env' itself
      it('should return currently set env', function() {
        expect(cfg.env).to.equal(env)
      })

      // port
      it('should return server port', function() {
        if (env in [TEST_LOCAL, DEV, TEST_LOCAL]) {
          expect(cfg.port).to.equal(settings.serverPort.local)
        }
        if (env === PROD) {
          expect(cfg.port).to.equal(settings.serverPort.remote)
        }
      })
    })
  })

  // test unknown environment
  describe('config should throw', function() {
    it('should throw', function() {
      expect(() => config('junk')).to.throw()
    })
  })
})
