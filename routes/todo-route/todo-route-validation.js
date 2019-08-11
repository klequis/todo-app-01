import { yellow } from 'logger'
import { pick } from 'ramda'
import { isValid } from 'date-fns'


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

