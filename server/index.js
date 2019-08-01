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
const lServerError = (debug)('server:ERROR')


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
  lServerError(err.message)
  let returnError = undefined
  const msg = err.message.toLowerCase()
  if (msg === 'no authorization token was found') {
    returnError = {
      status: 401,
      message: 'Not authorized'
    }
  } else if (msg.includes('no document found')) {
    returnError = {
      status: 404,
      message: 'Resource not found'
    }
  
  } else if (msg.includes('unknown route')) {
    returnError = {
      status: 400,
      message: 'Bad request'
    }
  } else {
    returnError = {
      status: 500,
      message: 'Internal server error'
    }
  }
  res.status(returnError.status)
  res.send(returnError.message)
  
  // Do I really need to call next here?
  // next(err)

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
  throw new Error(`unknown route: ..${req.url}`)
})

app.use(error)

if (!module.parent) {
  app.listen(config.port, () => {
    lServer(`Events API is listening on port ${config.port}`)
  })
}

export default app
