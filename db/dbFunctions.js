import mongodb, { ObjectID } from 'mongodb'
import { removeIdProp } from 'lib'
import config from '../config'
import { hasProp } from 'lib'
import { mergeRight, isEmpty, isNil } from 'ramda'
// eslint-disable-next-line
import { green } from 'logger'

const MongoClient = mongodb.MongoClient

let client

const idStringToObjectID = obj => {
  switch (typeof obj) {
    case 'string':
      return ObjectID(obj)
    case 'object':
      if (isEmpty(obj)) return obj
      if (!hasProp('_id', obj)) return obj
      const { _id: id } = obj
      const _id = typeof id === 'string' ? ObjectID(id) : id
      return mergeRight(obj, { _id })
    default:
      // TODO: should obj be returned?
      return obj
  }
}

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
 * @returns {object}
 */
export const insertMany = async (collection, data) => {
  // TODO: Allows insertion of _id. Should it? If yes they should be
  // converted to ObjectID
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
 * @returns {object}
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
 * @returns {array}
 *
 */
export const find = async (collection, filter = {}, projection = {}) => {
  const f = idStringToObjectID(filter)
  try {
    const { db } = await connectDB()
    return await db
      .collection(collection)
      .find(f)
      .project(projection)
      .toArray()
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {object} filter filter criteria
 * @param {object} project a valid projection
 * @returns {array}
 *
 */
export const findOne = async (collection, filter = {}, projection = {}) => {
  const f = idStringToObjectID(filter)
  try {
    const { db } = await connectDB()
    return await db.collection(collection).findOne(f, { projection })
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {string} id a valid _id as string
 * @param {object} project a valid projection
 * @returns {object}
 */
export const findById = async (collection, id, projection = {}) => {
  try {
    const _id = idStringToObjectID(id)
    const { db } = await connectDB()
    return await db
      .collection(collection)
      .find({ _id })
      .project(projection)
      .toArray()
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {string} id a valid _id as string
 * @returns {object}
 */
export const findOneAndDelete = async (collection, filter) => {
  try {
    const f = idStringToObjectID(filter)
    const { db } = await connectDB()

    const r = await db.collection(collection).findOneAndDelete(f)
    const { n, value } = r.lastErrorObject
    if (n === 0 && typeof value === 'undefined') {
      // throw an error
      throw new Error(
        `No document found for ${JSON.stringify(filter, null, 2)}`
      )
    }
    return [r.value]
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
 *
 * @param {string} collection the name of a collection
 * @param {string} id a valid _id as string
 * @param {object} update document properties to be updated such as { title: 'new title', completed: true }
 * @param {boolean} returnOriginal if true, returns the original document instead of the updated one
 * @returns {object}
 *
 */
export const findOneAndUpdate = async (
  collection,
  filter = {},
  update,
  returnOriginal = false
) => {
  try {
    const f = idStringToObjectID(filter)

    // if the update has the _id prop, remove it
    const u = removeIdProp(update)
    const { db } = await connectDB()
    const r = await db
      .collection(collection)
      .findOneAndUpdate(f, { $set: u }, { returnOriginal: returnOriginal })
    return [r.value]
  } catch (e) {
    throw new Error(e.message)
  }
}
