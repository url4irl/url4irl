import { MongoClient } from "mongodb";
import { backOff } from "exponential-backoff";

if (!process.env.MONGODB_DB) {
  throw new Error("Please add your Mongo DB Name to .env");
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env");
}

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

async function _connectToDatabase() {
  const client = await getMongoClient();
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);

  return db;
}

/**
 * Connects to the database and returns the database object.
 * Uses exponential backoff to retry the connection if it fails.
 */
export async function connectToDatabase() {
  return await backOff(() => _connectToDatabase(), {
    numOfAttempts: 10,
    jitter: "full",
    retry: (error, attemptNumber) => {
      console.warn(`Retrying connection to database #${attemptNumber}`, error);
      return true;
    },
  });
}

/**
 * Gets and resolves the MongoDB client promise.
 */
export async function getMongoClient() {
  const client = await clientPromise;

  if (!client) {
    throw new Error("Not connected to database");
  }

  return client;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
export { clientPromise as clientPromise };
