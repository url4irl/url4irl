import { getCollection } from "@url4irl/mongodb";

/**
 * Connects to the database and gets the users collection.
 */
export async function getUsersCollection() {
  return await getCollection("users");
}
