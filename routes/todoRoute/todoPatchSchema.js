export default [
  {
    field: '_id',
    location: 'param',
    expectedType: 'mongoId',
    errorMessage: 'todoid must be a valid MongodDB ObjectID as string',
    value: '123'
  },

  {
    field: 'completed',
    location: 'body',
    expectedType: 'boolean',
    errorMessage: 'completed must be boolean / true or false',
    value: '3'
  },
  {
    field: 'createdAt',
    location: 'body',
    expectedType: 'date',
    errorMessage: 'createdAt must be an ISODateString',
    value: '456'
  }
]
