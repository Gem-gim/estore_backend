// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client;

// const config = require("config");
// const MongoClient = require("mongodb").MongoClient;

// import { MongoClient, ServerApiVersion } from "mongodb";

// const options = {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// };

// const _connection: unknown;
// const _db: unknown;

// const closeConnection = () => {
//   _connection.close();
// };

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }

// const uri = process.env.MONGODB_URI;

// /**
//  * Connects to mongodb using config/config.js
//  * @returns Promise<Db> mongo Db instance
//  */
// const getDbConnection = async () => {
//   if (_db) {
//     return _db;
//   }
//   console.log("trying to connect");
//   const mongoClient = new MongoClient(uri, options);
//   _connection = await mongoClient.connect();
//   // _db = _connection.db(config.mongodb.databaseName);
//   // return _db;
// };

// // module.exports = { getDbConnection, closeConnection };

// export default getDbConnection;
