import { addDays, subDays } from 'date-fns'
import config from 'config'

const cfg = config()
const testUserUUID = cfg.testUser.uuid

export const fourTodos = [
  {
    completed: false,
    createdAt: subDays(new Date(), 2).toISOString(),
    lastUpdatedAt: subDays(new Date(), 1).toISOString(),
    title: 'first todo',
    userId: testUserUUID
  },
  {
    completed: false,
    createdAt: subDays(new Date(), 2).toISOString(),
    dueDate: addDays(new Date(), 2).toISOString(),
    lastUpdatedAt: subDays(new Date(), 1).toISOString(),
    title: 'second todo - due yesterday',
    userId: testUserUUID
  },
  {
    completed: false,
    createdAt: subDays(new Date(), 2).toISOString(),
    lastUpdatedAt: subDays(new Date(), 1).toISOString(),
    dueDate: addDays(new Date(), 2).toISOString(),
    title: 'third todo - due in two days',
    userId: testUserUUID
  },
  {
    completed: false,
    createdAt: subDays(new Date(), 2).toISOString(),
    lastUpdatedAt: subDays(new Date(), 1).toISOString(),
    title: 'fourth todo',
    userId: testUserUUID
  }
]
