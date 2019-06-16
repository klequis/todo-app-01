import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { fourTodos } from './fixture'
import {
  close,
  dropCollection,
  find,
  findById,
  findOneAndDelete,
  findOneAndUpdate,
  insertMany,
  insertOne
} from 'db'

import { yellow } from 'logger'

chai.use(chaiAsPromised)
const expect = chai.expect

const collectionName = 'todos'

after(async () => {
  await close()
})


describe('dbFunctions failure cases', function() {
  it('debug', async function() {
    const r = await find()
    yellow('r', r)
  })
  it('should throw: collection name must be a String', async function() {
    await expect(find()).to.eventually.be.rejectedWith(
      Error,
      'collection name must be a String'
    )
  })
  it('should throw: collection name must be a String', async function() {
    await expect(find('doesnt-exist')).to.eventually.be.rejectedWith(
      Error,
      'collection name must be a String'
    )
  })

})

describe.only('dbFunctions success cases', function() {
  describe('test insertMany', function() {
    it('insertMany: should insert 4 todos', async function() {
      const i = await insertMany(collectionName, fourTodos)
      expect(i.data.length).to.equal(4)
    })
  })

  describe('test dropCollection', function() {
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
    })
    // In the event the collection to drop is not found, dropCollection()
    // will return { data: true, error: null }
    it('should return true', async function() {
      const dc1 = await dropCollection(collectionName)
      expect(dc1.data).to.equal(true)
      const dc2 = await dropCollection(collectionName)
      expect(dc2.data).to.equal(true)
    })
  })

  describe('test insertOne', function() {
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
    })
    const newData = { title: 'todo added' }
    it('insertOne: should insert new document', async function() {
      const i = await insertOne(collectionName, newData)
      expect(i.data[0]._id).to.be.not.null
      expect(i.data[0].title).to.equal('todo added')
    })
  })

  describe('test find', function() {
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
    })
    it('find: should return 4 todos', async function() {
      const f = await find(collectionName)
      expect(f.data.length).to.equal(4)
    })
  })

  describe('test findById', function() {
    let idToFind = undefined
    before(async function() {
      await dropCollection(collectionName)
      const inserted = await insertMany(collectionName, fourTodos)
      idToFind = inserted.data[0]._id.toString()
    })
    it('findById: should return 1 todo with id of second todo', async function() {
      const f = await findById('todos', idToFind)
      expect(f.data.length).to.equal(1)
      const idFound = f.data[0]._id.toString()
      expect(idFound).to.equal(idToFind)
    })
  })

  describe('test findOneAndDelete', function() {
    let idToDelete = undefined
    before(async function() {
      await dropCollection(collectionName)
      const inserted = await insertMany(collectionName, fourTodos)
      idToDelete = inserted.data[1]._id.toString()
    })
    it('findOneAndDelete: should delete 1 of 4 todos', async function() {
      const deleted = await findOneAndDelete(collectionName, idToDelete)
      const idDeleted = deleted.data[0]._id.toString()
      expect(idDeleted).to.equal(idToDelete)
    })
  })

  describe('test findOneAndUpdate', function() {
    const newData = { title: 'changed title', completed: true }
    let idToUpdate = undefined
    before(async function() {
      await dropCollection(collectionName)
      const inserted = await insertMany(collectionName, fourTodos)
      idToUpdate = inserted.data[1]._id.toString()
    })
    it('findOneAndUpdate: should return updated document', async function() {
      const updated = await findOneAndUpdate(
        collectionName,
        idToUpdate,
        newData
      )
      expect(updated.data[0]._id.toString()).to.equal(idToUpdate)
      expect(updated.data[0].title).to.equal(newData.title)
      expect(updated.data[0].completed).to.equal(newData.completed)
    })
  })
})
