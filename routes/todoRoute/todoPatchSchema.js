import {
  typeMongoIdString,
  typeBoolean,
  typeISODateString,
  typeString,
  typeUUID,
} from 'routes/todoRoute/validateRequest'


export default [
  {
    field: '_id',
    location: 'body',
    expectedType: typeMongoIdString
  },
  {
    field: 'completed',
    location: 'body',
    expectedType: typeBoolean
  },
  {
    field: 'createdAt',
    location: 'body',
    expectedType: typeISODateString
  },
  {
    field: 'dueDate',
    location: 'body',
    expectedType: typeISODateString,
    // required: false
  },
  {
    field: 'lastUpdatedAt',
    location: 'body',
    expectedType: typeISODateString
  },
  {
    field: 'todoid',
    location: 'params',
    expectedType: typeMongoIdString
  },
  {
    field: 'title',
    location: 'body',
    expectedType: typeString,
    rules: {
      minLength: 2,
      maxLength: 30
    }
  },
  {
    field: 'userId',
    location: 'body',
    expectedType: typeUUID
  },
  {
    field: 'userid',
    location: 'params',
    expectedType: typeUUID
  }
  // {
  //   field: 'dueDate',
  //   location: 'body',
  //   expectedType: 'date',
  //   errorMessage: 'createdAt must be an ISODateString',
  // }
]
