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
  email: 'testUser@test.com',
  title: 'a good todo'
}
// missingEmailTodo
export const missingEmailTodo = {
  title: 'a good todo'
}
// invalidEmailTodo
export const invalidEmailTodo01 = {
  email: 'testUser@test',
  title: 'a good todo'
}
export const invalidEmailTodo02 = {
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
