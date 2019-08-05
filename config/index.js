// settings are in keybase

import settings from './config.settings'
import { bluef } from '../logger'

const TEST_LOCAL = 'testLocal'
const TEST_REMOTE = 'testRemote'
const DEV = 'development'
const PROD = 'production'


const unknowEnvName = (env) => `ERROR: config/index.js: unknown environment name: ${env}. Must be ${TEST_LOCAL}, ${TEST_REMOTE}, ${DEV} or ${PROD}`

export const mongoUri = env => {
  switch (env) {
    case TEST_LOCAL:
      bluef('env: ', env)
      bluef('monguUri: ', settings.db.testLocal.mongoUri)
      return settings.db.testLocal.mongoUri
    case TEST_REMOTE:
      bluef('env: ', env)
      bluef('monguUri: ', settings.db.testRemote.mongoUri)
      return settings.db.testRemote.mongoUri
    case DEV:
      bluef('env: ', env)
      bluef('monguUri: ', settings.db.development.mongoUri)
      return settings.db.development.mongoUri
    case PROD:
      return settings.db.production.mongoUri
    default:
      throw new Error(unknowEnvName())
  }
}

export const dbName = env => {
  switch (env) {
    case TEST_LOCAL:
      return settings.dbName.test
    case TEST_REMOTE:
      return settings.dbName.test
    case DEV:
      return settings.dbName.development
    case PROD:
      return settings.dbName.production
    default:
      throw new Error(unknowEnvName())
  }
}

export const apiRoot = (env)  => {
  bluef('apiRoot: env', env);
  
  switch (env) {
    case TEST_LOCAL:
    case DEV:
      return settings.apiRoot.local
    case TEST_REMOTE:
    case PROD:
      return settings.apiRoot.remote
    default:
      throw new Error(unknowEnvName())
  }
}


export default {
  mongoUri: mongoUri(process.env.NODE_ENV),
  dbName: dbName(process.env.NODE_ENV),
  apiRoot: apiRoot(process.env.NODE_ENV),
  port: 3030,
  env: process.env.NODE_ENV,
  auth0: settings.auth0
};
