import { connectToDatabase } from "./db";

/**
 * Connects to the database and gets a given collection.
 */
export async function getCollection(name: string) {
  return (await connectToDatabase()).collection(name);
}
