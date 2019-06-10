import { expect } from 'chai'
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

const collectionName = 'todos'

after(async () => {
  await close()
})

describe('dbFunctions', function() {
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
      expect(i.data._id).to.be.not.null
      expect(i.data.title).to.equal('todo added')
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
      const idDeleted = deleted.data._id.toString()
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
      expect(updated.data._id.toString()).to.equal(idToUpdate)
      expect(updated.data.title).to.equal(newData.title)
      expect(updated.data.completed).to.equal(newData.completed)
    })
  })
})
