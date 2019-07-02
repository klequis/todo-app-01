import settings from './config.settings'

const unknowEnvName = 'ERROR: config/index.js: unknown environment name. Must be testLocal, testRemote, dev or prod'

export const mongoUri = env => {
  switch (env) {
    case 'testLocal':
      console.log('env: ', env)
      console.log('monguUri: ', settings.db.testLocal.mongoUri)
      return settings.db.testLocal.mongoUri
    case 'testRemote':
      console.log('env: ', env)
      console.log('monguUri: ', settings.db.testRemote.mongoUri)
      return settings.db.testRemote.mongoUri
    case 'dev':
      console.log('env: ', env)
      console.log('monguUri: ', settings.db.dev.mongoUri)
      return settings.db.dev.mongoUri
    case 'prod':
      return settings.db.prod.mongoUri
    default:
      throw new Error(unknowEnvName)
  }
}

export const dbName = env => {
  switch (env) {
    case 'testLocal':
      return settings.dbName.test
    case 'testRemote':
      return settings.dbName.test
    case 'dev':
      return settings.dbName.dev
    case 'prod':
      return settings.dbName.prod
    default:
      throw new Error(unknowEnvName)
  }
}

export const apiRoot = (env)  => {
  console.log('apiRoot: env', env);
  
  switch (env) {
    case 'testLocal':
    case 'dev':
      return settings.apiRoot.local
    case 'testRemote':
    case 'prod':
      return settings.apiRoot.remote
    default:
      throw new Error(unknowEnvName)
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
