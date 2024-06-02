import { ObjectId } from "@url4irl/mongodb";
import { getUsersCollection } from "./collection";

/**
 * Gets an user by its email
 *
 * @param {string} userEmail The user email
 */
export async function getUserByEmail(userEmail: string) {
  const collection = await getUsersCollection();

  const cursor = collection.find({ email: userEmail }).limit(1);

  const result = await cursor.toArray();

  await cursor.close();

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

/**
 * Gets an user by its id
 *
 * @param {userId} userId The user id
 */
export async function getUserById(userId: string) {
  const collection = await getUsersCollection();

  const cursor = collection.find({ _id: new ObjectId(userId) }).limit(1);

  const result = await cursor.toArray();

  await cursor.close();

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

/**
 * Gets all users with pagination options
 */
export async function getUsers(options: GetUsersProps) {
  const { limit, skip } = options;

  const collection = await getUsersCollection();

  const cursor = collection.find({}).sort({ _id: -1 }).limit(limit).skip(skip);

  const result = await cursor.toArray();

  await cursor.close();

  if (result.length === 0) {
    return null;
  }
}

interface GetUsersProps {
  limit: number;
  skip: number;
}
