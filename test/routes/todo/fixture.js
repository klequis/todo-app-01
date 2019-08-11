import config from 'config'

const cfg = config()

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


// goodTodo
export const goodTodo = {
  title: 'a good todo',
  userId: 'auth0|5d1c0ac7a482030ea3eaf087',
}
// missingEmailTodo
export const missingUserIdTodo = {
  title: 'missing my userId'
}
// invalidEmailTodo
export const invalidUserIdTodo01 = {
  title: 'a good todo',
  userId: 'auth0|5e1f0gh7i482030jk3lmf087', // mutated guid
}
export const invalidUserIdTodo02 = {
  email: 'testUsertest.com',
  title: 'a good todo'
}
// missingTitleTodo
export const missingTitleTodo = {
  email: 'testUser@test.com'
}
// titleTooShort
export const titleTooShortTodo = {
  email: 'testUser@test.com',
  title: 'ab'
}
// emptyTitle
export const emptyTitleTodo = {
  email: 'testUser@test.com',
  title: ''
}
