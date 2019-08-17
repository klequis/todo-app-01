import { addDays } from 'date-fns'
import config from 'config'

const cfg = config()
export const auth0UUID = cfg.testUser.auth0UUID

// all user edit fields
export const aNewTodoWithDueDate = {
  dueDate: addDays(new Date(), 1).toISOString(),
  title: 'post: all user edit fields',
  userId: auth0UUID
}

export const aNewTodoWithoutDueDate = {
  title: 'post: all user edit fields',
  userId: auth0UUID
}

// missing userId
export const todoMissingUserIdInBody = {
  title: 'missing userId in body'
}
// invalid userId
export const todoInvalidUserIdInBody = {
  title: 'a good todo',
  userId: 'aaaa-bbbb'
}

// title too short
export const todoTitleTooShort = {
  title: 'ab',
  userId: auth0UUID
}
