import config from 'config'

const cfg = config()
export const auth0UUID = cfg.testUser.auth0UUID

export const fourTodos = [
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'first todo',
    userId: auth0UUID
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'second todo',
    userId: auth0UUID
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'third todo',
    userId: auth0UUID
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'fourth todo',
    userId: auth0UUID
  }
]

