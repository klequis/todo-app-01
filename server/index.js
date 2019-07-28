import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import config from '../config'
import todo from '../routes/todo-route'
import debug from 'debug'
import { yellow } from '../logger'


const lServer = (debug)('server')


const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth0.jwksUri
  }),
  audience: config.auth0.apiIdentifier,
  issuer: config.auth0.auth0Domain,
  algorithm: config.auth0.algorithm
})

const app = express()

const error = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    yellow('not authorized')
    res.status(401)
    res.send('Not authorized')
  } else {
    yellow('err', err)
  res.status(500)
  res.send('Internal server error')
  }
  
  // YOU NEED TO CALL next() SOMEWHERE
  // maybe here
  // maybe in each route


}

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/ping', async (req, res) => {
  try {
    res.send(JSON.stringify({ status: 'All good here.' }))
  } catch (e) {
    res.send()
    res.send(JSON.stringify({ status: 'Something went wrong.' }))
  }
})

app.use(checkJwt)
app.use('/api/todo', todo)

app.get('*', function(req, res) {
  throw new Error('unknown route!')
})

app.use(error)

if (!module.parent) {
  app.listen(config.port, () => {
    lServer(`Events API is listening on port ${config.port}`)
  })
}

export default app
