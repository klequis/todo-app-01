export default [
  {
    field: '_id',
    location: 'params',
    expectedType: 'mongoId',
    errorMessage: 'todoid must be a valid MongodDB ObjectID as string',
  },

  {
    field: '_id',
    location: 'body',
    expectedType: 'mongoId',
    errorMessage: 'todoid must be a valid MongodDB ObjectID as string',
  },
  {
    field: 'completed',
    location: 'body',
    expectedType: 'boolean',
    errorMessage: 'completed must be boolean / true or false',
  },
  {
    field: 'createdAt',
    location: 'body',
    expectedType: 'date',
    errorMessage: 'createdAt must be an ISODateString',
  },
  {
    field: 'userId',
    location: 'body',
    expectedType: 'string',
    errorMessage: 'userId must be a string'
  }
  // {
  //   field: 'dueDate',
  //   location: 'body',
  //   expectedType: 'date',
  //   errorMessage: 'createdAt must be an ISODateString',
  // }

]
