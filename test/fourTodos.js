import { addDays, subDays } from 'date-fns'
import config from 'config'

const cfg = config()
const auth0UUID = cfg.testUser.auth0UUID

export const fourTodos = [
         {
           completed: false,
           createdAt: subDays(new Date(), 2).toISOString(),
           lastUpdatedAt: subDays(new Date(), 1).toISOString(),
           title: 'first todo',
           userId: auth0UUID
         },
         {
           completed: false,
           createdAt: subDays(new Date(), 2).toISOString(),
           dueDate: addDays(new Date(), 2).toISOString(),
           lastUpdatedAt: subDays(new Date(), 1).toISOString(),
           title: 'second todo - due yesterday',
           userId: auth0UUID
         },
         {
           completed: false,
           createdAt: subDays(new Date(), 2).toISOString(),
           lastUpdatedAt: subDays(new Date(), 1).toISOString(),
           dueDate: addDays(new Date(), 2).toISOString(),
           title: 'third todo - due in two days',
           userId: auth0UUID
         },
         {
           completed: false,
           createdAt: subDays(new Date(), 2).toISOString(),
           lastUpdatedAt: subDays(new Date(), 1).toISOString(),
           title: 'fourth todo',
           userId: auth0UUID
         }
       ]
