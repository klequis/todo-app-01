import config from 'config'

const cfg = config()

const auth0Id = cfg.testUser.auth0Id

export const fourTodos = [
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    userId: auth0Id,
    title: 'first todo'
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'second todo',
    userId: auth0Id
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'third todo',
    userId: auth0Id
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'fourth todo',
    userId: auth0Id
  }
]

const patchErrors = {
  _id: {
    msg: 'Parameter id must be a valid MongodDB hex string.',
    param: 'id',
    location: 'body'
  },
  completed: {
    msg: 'Completed must be true or false.',
    param: 'completed',
    location: 'body'
  },
  createdAt: {
    msg: 'this.validator is not a function',
    param: 'createdAt',
    location: 'body'
  },
  title: {
    msg: 'Title must be at least 3 characters long.',
    param: 'title',
    location: 'body'
  },
  userId: { msg: 'Unknown user.', param: 'userId', location: 'body' }
}
