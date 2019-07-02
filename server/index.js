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

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth0.jwksUri
  }),

  // Validate the audience and the issuer.
  audience: config.auth0.appIdentifier,
  // issuer: `https://<AUTH0_DOMAIN>/`,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  // algorithms: ["RS256"]
  algorithms: config.auth0.algorithms
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
