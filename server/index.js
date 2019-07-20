import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import bodyParser from 'body-parser'
import cors from 'cors'
import config from '../config'

// import todo from 'routes/todo-route'
import todo from '../routes/todo-route'
import { yellow } from '../logger';

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

const abc = () => {
  return
}

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))


app.get('/ping', async (req, res) => {
  try {
    res.send(JSON.stringify({ status: 'All good here.'}))
  } catch (e) {
    res.send()
    res.send(JSON.stringify({ status: 'Something went wrong.' }))
  }
})

// app.use(checkJwt)
app.use('/api/todo', todo)


app.use(function(err, req, res, next) {
  
  yellow('err', err.message)
  if (false) {
    res.status(404).send('Unknown endpoint')
  } else {
    next(err)
  }
})

// app.use(function(err, req, res, next) {
//   yellow(err.stack)
//   res.status(500).send('Something broke!')
// })

// app.use(function(err, req, res, next) {
//   yellow('err', err)
//   res.status(404).send('Unknown endpoint')
//   // if (err.name === 'UnauthorizedError') {
//   //   yellow('UnauthorizedError')
//   //   res.status(401).send('invalid token...')
//   // }
//   // yellow('other error')
//   // res.status(404).send('Unknown endpoint')
// })



if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`Events API is listening on port ${config.port}`)
  })
}

export default app
