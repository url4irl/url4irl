import { eq, and, count } from "drizzle-orm";
import { getConnection, follows, users } from "@url4irl/db";
import { generateId, PaginationOptions, createPaginatedResult } from "@url4irl/core";
import { FollowResult, UnfollowResult, FollowStats } from "./types";

export async function followUser(followerId: string, followingId: string): Promise<FollowResult> {
  try {
    if (followerId === followingId) {
      return { success: false, error: "Cannot follow yourself" };
    }

    const db = getConnection();
    
    const existingFollow = await db
      .select()
      .from(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ))
      .limit(1);

    if (existingFollow.length > 0) {
      return { success: false, error: "Already following this user" };
    }

    const newFollow = {
      id: generateId(),
      followerId,
      followingId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(follows).values(newFollow).returning();
    
    return { success: true, follow: result[0] };
  } catch (error) {
    return { success: false, error: `Failed to follow user: ${error}` };
  }
}

export async function unfollowUser(followerId: string, followingId: string): Promise<UnfollowResult> {
  try {
    const db = getConnection();
    
    const result = await db
      .delete(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to unfollow user: ${error}` };
  }
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  try {
    const db = getConnection();
    
    const result = await db
      .select()
      .from(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    return false;
  }
}

export async function getFollowers(userId: string, options: PaginationOptions) {
  const db = getConnection();
  
  const followersData = await db
    .select({
      follower: users,
      followedAt: follows.createdAt,
    })
    .from(follows)
    .innerJoin(users, eq(follows.followerId, users.id))
    .where(eq(follows.followingId, userId))
    .limit(options.limit)
    .offset(options.offset)
    .orderBy(follows.createdAt);

  const totalCount = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followingId, userId));

  return createPaginatedResult(
    followersData,
    totalCount[0].count,
    options
  );
}

export async function getFollowing(userId: string, options: PaginationOptions) {
  const db = getConnection();
  
  const followingData = await db
    .select({
      following: users,
      followedAt: follows.createdAt,
    })
    .from(follows)
    .innerJoin(users, eq(follows.followingId, users.id))
    .where(eq(follows.followerId, userId))
    .limit(options.limit)
    .offset(options.offset)
    .orderBy(follows.createdAt);

  const totalCount = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followerId, userId));

  return createPaginatedResult(
    followingData,
    totalCount[0].count,
    options
  );
}

export async function getFollowStats(userId: string): Promise<FollowStats> {
  const db = getConnection();
  
  const [followersCount, followingCount] = await Promise.all([
    db.select({ count: count() }).from(follows).where(eq(follows.followingId, userId)),
    db.select({ count: count() }).from(follows).where(eq(follows.followerId, userId)),
  ]);

  return {
    followers: followersCount[0].count,
    following: followingCount[0].count,
  };
}