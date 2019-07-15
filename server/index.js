import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import bodyParser from 'body-parser'
import cors from 'cors'
import config from 'config'

import { yellow, red } from 'logger'

// import todo from 'routes/todo-route'
import todo from '../routes/todo-route'

const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')


yellow('config', config)

const authConfig = {
  domain: 'klequis-todo.auth0.com',
  audience: 'https://klequis-todo.tk'
}

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://klequis-todo.auth0.com/.well-known/jwks.json`
  }),

  audience: "https://klequis-todo.tk",
  
  issuer: `https://klequis-todo.auth0.com/`,

  // algorithm: config.auth0.algorithms
  algorithm: ['RS256']
})

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))


app.get('/ping', async (req, res) => {
  try {
    res.send('all good here')
  } catch (e) {
    res.send('something went wrong')
  }
})

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
