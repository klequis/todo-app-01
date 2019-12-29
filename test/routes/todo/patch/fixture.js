import config from 'config'

const cfg = config()
export const testUserUUID = cfg.testUser.uuid

// TODO: having userId in fixture here is an exception. Is there a reason for it?

export const fourTodos = [
  {
    completed: false,
    createdAt: '2019-08-12T17:01:16.927Z',
    lastUpdatedAt: '2019-08-12T17:01:16.927Z',
    title: 'first todo',
    userId: testUserUUID
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
