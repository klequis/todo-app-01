import { pick } from 'ramda'

/**
 *
 * @description filter out any unknown fields
 *
 * @param {object} todo
 *
 *
 */

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
