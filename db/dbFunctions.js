import mongodb, { ObjectID } from 'mongodb'
import { removeIdProp } from 'lib'
import config from '../config'
import { hasProp } from 'lib'
import { mergeRight } from 'ramda'
import { green } from 'logger'

const MongoClient = mongodb.MongoClient

let client

const connectDB = async () => {
  try {
    const cfg = config()
    if (!client) {
      client = await MongoClient.connect(cfg.mongoUri, {
        useNewUrlParser: true
      })
    }
    return { db: client.db(cfg.dbName) }
  } catch (e) {
    throw new Error('Unable to connect to MongoDB')
  }
}

export const close = async () => {
  if (client) {
    client.close()
  }
  client = undefined
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {Array} data  an array of documents, without _id, to be inserted
 *
 * @returns {object} { data: [], error: '' } where data is an array of one or more documents
 */
export const insertMany = async (collection, data) => {
  try {
    const { db } = await connectDB()
    const r = await db.collection(collection).insertMany(data)
    return r.ops
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @returns {boolean}
 *
 */
export const dropCollection = async collection => {
  try {
    const { db } = await connectDB()
    return await db.collection(collection).drop()
  } catch (e) {
    if ((e.message = 'ns not found')) {
      return true
    } else {
      throw new Error(e.message)
    }
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {object} data a documnet, without _id, to be inserted
 * @returns {object} { data: [], error: '' } where data is always an array of 1
 *
 */
export const insertOne = async (collection, data) => {
  try {
    const { db } = await connectDB()
    const r = await db.collection(collection).insertOne(data)
    return r.ops
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {object} filter filter criteria
 * @param {object} project a valid projection
 * @returns {array} { data: [], error: '' } where data is an array of one or more documents
 *
 */
export const find = async (collection, filter = {}, project = {}) => {
  // currently find returns _id as an Object. The client will always get a string.
  // I see no reason to pass an ObjectID back here, it just increases complexity in
  // testing and in the routes when validating.
  // Going to try to always pass back the id as a string and see how it goes
  // ** check other functions where ObjectID may be passed back
  // actuall, maybe I don't care?
  try {
    const { db } = await connectDB()
    return await db
      .collection(collection)
      .find(filter)
      .project(project)
      .toArray()
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {string} id a valid _id as string
 * @param {object} project a valid projection
 * @returns {object} { data: [], error: '' } where data is always an array of 1
 */
export const findById = async (collection, id, project = {}) => {
  try {
    const { db } = await connectDB()
    return await db
      .collection(collection)
      .find({ _id: ObjectID(id) })
      .project(project)
      .toArray()
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {string} id a valid _id as string
 * @returns {object} { data: [], error: '' } where data is always an array of 1
 */
export const findOneAndDelete = async (collection, id) => {
  try {
    const { db } = await connectDB()
    
    const r = await db
      .collection(collection)
      .findOneAndDelete({ _id: ObjectID(id) })
    const { n, value } = r.lastErrorObject
    if (n === 0 && typeof value === 'undefined') {
      // throw an error
      throw new Error(`No document found for _id ${id}`)
    }
    return [r.value]
  } catch (e) {
    throw e
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {string} id a valid _id as string
 * @param {object} update document properties to be updated such as { title: 'new title', completed: true }
 * @param {boolean} returnOriginal if true, returns the original document instead of the updated one
 * @returns {object} { data: [], error: '' } where data is always an array of 1
 *
 */
export const findOneAndUpdate = async (
  collection,
  filter={},
  update,
  returnOriginal = false
) => {
  green('collection', collection)
  green('filter', filter)  
  green('update', update)

  try {
    // if filter has a string _id it must be converted to ObjectID
    let _id = undefined
    if (hasProp('_id', filter)) {
      const { _id: id } = filter
      
      _id = typeof id === 'string' ? ObjectID(id) : id
    }
    const newFilter = !(_id === undefined) ? mergeRight(filter, { _id }) : filter

    // if the update has the _id prop, remove it
    const cleanedUpdate = removeIdProp(update)
    const { db } = await connectDB()
    const r = await db
      .collection(collection)
      .findOneAndUpdate(
        newFilter,
        { $set: cleanedUpdate },
        { returnOriginal: returnOriginal }
      )
    return [r.value]
  } catch (e) {
    throw new Error(e.message)
  }
}
