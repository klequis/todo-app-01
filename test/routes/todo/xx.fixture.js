import config from 'config'
import { yellow } from 'logger'

const cfg = config()

const testUserUUID = cfg.testUser.uuid


export const fourTodos = [
  {
    completed: false,
    userId: testUserUUID,
    title: 'first todo'
  },
  {
    title: 'second todo',
    completed: false,
    userId: testUserUUID
  },
  {
    title: 'third todo',
    completed: false,
    userId: testUserUUID
  },
  {
    title: 'fourth todo',
    completed: false,
    userId: testUserUUID
  }
]

export const fourTodosForPost = [
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    userId: testUserUUID,
    title: 'first todo'
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'second todo',
    userId: testUserUUID
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'third todo',
    userId: testUserUUID
  },
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'fourth todo',
    userId: testUserUUID
  }
]

// minium fields for post
export const todoMinimumFieldsForPost = {
  title: 'a good todo',
  userId: testUserUUID
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
  userId: testUserUUID
}
// title too short
export const todoTitleTooShort = {
  userId: testUserUUID,
  title: 'ab'
}
// empty title
export const todoEmptyTitle = {
  userId: testUserUUID,
  title: ''
}
