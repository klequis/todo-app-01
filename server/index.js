import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import todo from 'routes/todo-route'
import config from 'config'
import { red } from 'logger'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/api/todo', todo)
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
// app.get('*', (req, res) => {
//   red('Unknown endpoint!')
//   res.status(404).send('Unknown endpoint')
// })

if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`Events API is listening on port ${config.port}`)
  })
}

export default app
