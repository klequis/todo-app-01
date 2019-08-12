import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import config from '../config'
import todo from '../routes/todo-route'
import debug from 'debug'
import { redf, red } from '../logger'

// debug
// debug is not working in 'testLocal'. Maybe take this code out
// debug.enable('testLocal')
// console.log(2, debug.enabled('testLocal'))
const lServer = debug('server')
const lServerError = debug('server:ERROR')

const cfg = config()

const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: cfg.auth0.jwksUri
  }),
  audience: cfg.auth0.apiIdentifier,
  issuer: cfg.auth0.auth0Domain,
  algorithm: cfg.auth0.algorithm
})

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/health', async (req, res) => {
  try {
    res.send(JSON.stringify({ status: 'All good here.' }))
  } catch (e) {
    res.send()
    res.send(JSON.stringify({ status: 'Something went wrong.' }))
  }
})

red('WARNING: token check is off!!')
// app.use(checkJwt)

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json')
  next()
})
app.use('/api/todo', todo)

app.get('*', function(req, res) {
  throw new Error(`unknown route: ..${req.url}`)
})

const logError = (err, verbose=false) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log()
    if (verbose) {
      redf('server.error', err) // works in test
      lServerError(err) // works only in dev
    } else {
      redf('server.error', err.message) // works in test
      lServerError(err.message) // works only in dev
    }
    console.log()
  }
}

const error = (err, req, res, next) => {
  let expectedErr = false

  let status
  const msg = err.message.toLowerCase()

  if (msg === 'no authorization token was found') {
    status = 401
    logError(err)
  } else if (msg.includes('no document found')) {
    status = 404
    logError(err)
  } else if (msg.includes('unknown route')) {
    status = 400
    logError(err)
  } else if (msg.includes('unexpected string in json')) {
    status = 400
    logError(err)
  } else {
    status = 500
    logError(err, true)
  }

  res.status(status)
  res.send()
}

app.use(error)

if (!module.parent) {
  app.listen(cfg.port, () => {
    lServer(`Events API is listening on port ${cfg.port}`)
  })
}

export default app
