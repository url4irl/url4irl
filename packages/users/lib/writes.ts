import { ObjectId } from "@url4irl/mongodb";
import { getUsersCollection } from "./collection";

/**
 * Updates a user's account with the provided data.
 *
 * @param {string} userId
 * @param {object} data
 */
export async function updateUser<T>(userId: string, data: T) {
  const collection = await getUsersCollection();

  const result = await collection.updateOne(
    {
      _id: new ObjectId(userId),
    },
    {
      $set: {
        ...data,
      },
    },
  );

  return result;
}
