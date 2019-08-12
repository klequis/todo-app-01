import config from 'config'

const cfg = config()

const auth0Id = cfg.testUser.auth0Id


export const fourTodos = [
  {
    title: 'first todo',
    completed: false
  },
  {
    title: 'second todo',
    completed: false
  },
  {
    title: 'third todo',
    completed: false
  },
  {
    title: 'fourth todo',
    completed: false
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
