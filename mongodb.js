const { MongoClient } = require('mongodb')

const MONGODB_URI = 'mongodb+srv://example:V7ZrpCR9vLMdnAF@cluster0.kect8.mongodb.net/example?retryWrites=true&w=majority';
const MONGODB_DB = 'example';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

let cached = global.mongo
if (!cached) cached = global.mongo = {}

async function connectToDatabase() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    const conn = {}
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    cached.promise = MongoClient.connect(MONGODB_URI, opts)
      .then((client) => {
        conn.client = client
        return client.db(MONGODB_DB)
      })
      .then((db) => {
        conn.db = db
        cached.conn = conn
      })
  }
  await cached.promise
  return cached.conn
}


module.exports = { connectToDatabase };