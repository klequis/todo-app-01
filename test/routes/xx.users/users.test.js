// import { expect } from 'chai'
// import { dropCollection, find, insertMany } from 'db'
// import getToken from 'test/get-token'
// import sendRequest from 'test/sendRequest'
// import { USER_COLLECTION_NAME } from 'routes/constants'
// import { yellow } from 'logger'


// const postUri = '/api/users'
// const user1 = {
//   userId: 'auth0|5d1c0ac7a482030ea3eaf087',
//   email: 'joe@joe.com'
// }

// describe.only(`test POST ${postUri}`, function() {
//   let token
//   before(async function() {
//     token = await getToken()
//     await dropCollection(USER_COLLECTION_NAME)
//   })

//   it('should return new user', async function() {
//     const r = await sendRequest({
//       method: 'POST',
//       uri: postUri,
//       status: 200,
//       body: user1,
//       token
//     })
//     yellow('r.body', r.body)

//   })

//   it('should return existing user', async function() {
//     const r = await sendRequest({
//       method: 'POST',
//       uri: postUri,
//       status: 200,
//       body: user1,
//       token
//     })
//   })

// })
