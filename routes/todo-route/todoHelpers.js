import { pick } from 'ramda'
export const filterFields = todo => {
  return pick(
    [
      '_id',
      'completed',
      'createdAt',
      'dueDate',
      'lastUpdatedAt',
      'title',
      'userId'
    ],
    todo
  )
}
