import config from 'config'
import { yellow } from 'logger'

const cfg = config()

const auth0Id = cfg.testUser.auth0Id


export const fourTodos = [
  {
    completed: false,
    userId: auth0Id,
    title: 'first todo'
  },
  {
    title: 'second todo',
    completed: false,
    userId: auth0Id
  },
  {
    title: 'third todo',
    completed: false,
    userId: auth0Id
  },
  {
    title: 'fourth todo',
    completed: false,
    userId: auth0Id
  }
]

export const fourTodosForPost = [
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

// minium fields for post
export const todoMinimumFieldsForPost = {
  title: 'a good todo',
  userId: auth0Id
}
// missing userId
export const todoMissingUserId = {
  title: 'missing my userId'
}
// invalid userId
export const todoInvalidUserId = {
  title: 'a good todo',
  userId: '5e1f0gh7i482030jk3lmf087' // mutated guid
}

// junk userId with '|'
export const todoJunkUserId = {
  userId: 'some|oddStuff',
  title: 'a good todo'
}

export const todoMissingTitle = {
  userId: auth0Id
}
// title too short
export const todoTitleTooShort = {
  userId: auth0Id,
  title: 'ab'
}
// empty title
export const todoEmptyTitle = {
  userId: auth0Id,
  title: ''
}
