import config from 'config'
import { addDays } from 'date-fns'
import { yellow } from 'logger'

const cfg = config()

const auth0Id = cfg.testUser.auth0Id

const tomorrow = () => {
  const tomorrowDay = new Date().getDay() + 1
  yellow('tomorrowDay', tomrrowDay)
  return new Date(2020, 1, 1, 3, 30, 30, 100).toISOString()
}
// const earlyDate = new Date(2020, 01, 01, 3, 30, 30, 100).toISOString()

// all user edit fields
export const aNewTodoWithDueDate = {
  dueDate: addDays(new Date(), 1).toISOString(),
  title: 'post: all user edit fields',
  userId: auth0Id
}

export const aNewTodoWithoutDueDate = {
  title: 'post: all user edit fields',
  userId: auth0Id
}

// missing userId
export const todoMissingUserId = {
  title: 'missing my userId'
}
// invalid userId
export const todoInvalidUserId = {
  title: 'a good todo',
  userId: 'auth0|5e1f0gh7i482030jk3lmf087' // mutated guid
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
