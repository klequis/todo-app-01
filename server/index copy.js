import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import todo from 'routes/todo-route'
import config from 'config'
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

import { yellow, red } from 'logger'




yellow('config', config)

const authConfig = {
  domain: 'klequis-todo.auth0.com',
  audience: 'https://klequis-todo.tk'
}

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // jwksUri: config.auth0.jwksUri
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  // audience: config.auth0.appIdentifier,
  audience: authConfig.audience,

  // issuer: `https://<AUTH0_DOMAIN>/`,
  // issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  issuer: `https://${authConfig.domain}/`,

  // algorithm: config.auth0.algorithms
  algorithm: ["RS256"]
})

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use(checkJwt)
app.use('/api/todo', todo)
app.use(function(req, res, next) {
  res.status(404).send('Unknown endpoint')
})

if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`Events API is listening on port ${config.port}`)
  })
}

export default app
