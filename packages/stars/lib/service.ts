import { eq, and, count } from "drizzle-orm";
import { getConnection, stars, posts, users } from "@url4irl/db";
import { generateId, createPaginatedResult, PaginationOptions } from "@url4irl/core";
import { StarResult, UnstarResult } from "./types";

export async function starPost(userId: string, postId: string): Promise<StarResult> {
  try {
    const db = getConnection();
    
    const existingStar = await db
      .select()
      .from(stars)
      .where(and(
        eq(stars.userId, userId),
        eq(stars.postId, postId)
      ))
      .limit(1);

    if (existingStar.length > 0) {
      return { success: false, error: "Post already starred" };
    }

    const newStar = {
      id: generateId(),
      userId,
      postId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(stars).values(newStar).returning();
    
    return { success: true, star: result[0] };
  } catch (error) {
    return { success: false, error: `Failed to star post: ${error}` };
  }
}

export async function unstarPost(userId: string, postId: string): Promise<UnstarResult> {
  try {
    const db = getConnection();
    
    const result = await db
      .delete(stars)
      .where(and(
        eq(stars.userId, userId),
        eq(stars.postId, postId)
      ));

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to unstar post: ${error}` };
  }
}

export async function isStarred(userId: string, postId: string): Promise<boolean> {
  try {
    const db = getConnection();
    
    const result = await db
      .select()
      .from(stars)
      .where(and(
        eq(stars.userId, userId),
        eq(stars.postId, postId)
      ))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    return false;
  }
}

export async function getPostStars(postId: string, options: PaginationOptions) {
  const db = getConnection();
  
  const postStars = await db
    .select({
      star: stars,
      user: users,
    })
    .from(stars)
    .innerJoin(users, eq(stars.userId, users.id))
    .where(eq(stars.postId, postId))
    .limit(options.limit)
    .offset(options.offset)
    .orderBy(stars.createdAt);

  const totalCount = await db
    .select({ count: count() })
    .from(stars)
    .where(eq(stars.postId, postId));

  return createPaginatedResult(
    postStars,
    totalCount[0].count,
    options
  );
}

export async function getUserStarredPosts(userId: string, options: PaginationOptions) {
  const db = getConnection();
  
  const starredPosts = await db
    .select({
      star: stars,
      post: posts,
      author: users,
    })
    .from(stars)
    .innerJoin(posts, eq(stars.postId, posts.id))
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(stars.userId, userId))
    .limit(options.limit)
    .offset(options.offset)
    .orderBy(stars.createdAt);

  const totalCount = await db
    .select({ count: count() })
    .from(stars)
    .where(eq(stars.userId, userId));

  return createPaginatedResult(
    starredPosts,
    totalCount[0].count,
    options
  );
}

export async function getStarCount(postId: string): Promise<number> {
  try {
    const db = getConnection();
    
    const result = await db
      .select({ count: count() })
      .from(stars)
      .where(eq(stars.postId, postId));

    return result[0].count;
  } catch (error) {
    return 0;
  }
}