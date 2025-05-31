import { eq, desc, and, ilike, inArray } from "drizzle-orm";
import { getConnection, posts, users } from "@url4irl/db";
import { generateId, sanitizeContent, createPaginatedResult, PaginationOptions } from "@url4irl/core";
import { CreatePostData, UpdatePostData, PostResult, PostFeedOptions } from "./types";

export async function createPost(data: CreatePostData): Promise<PostResult> {
  try {
    const db = getConnection();
    
    const newPost = {
      id: generateId(),
      userId: data.userId,
      content: sanitizeContent(data.content),
      imageUrl: data.imageUrl,
      hashtags: data.hashtags || [],
      mentions: data.mentions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(posts).values(newPost).returning();
    
    return { success: true, post: result[0] };
  } catch (error) {
    return { success: false, error: `Failed to create post: ${error}` };
  }
}

export async function updatePost(postId: string, userId: string, data: UpdatePostData): Promise<PostResult> {
  try {
    const db = getConnection();
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (data.content !== undefined) {
      updateData.content = sanitizeContent(data.content);
    }
    if (data.imageUrl !== undefined) {
      updateData.imageUrl = data.imageUrl;
    }
    if (data.hashtags !== undefined) {
      updateData.hashtags = data.hashtags;
    }
    if (data.mentions !== undefined) {
      updateData.mentions = data.mentions;
    }

    const result = await db
      .update(posts)
      .set(updateData)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Post not found or unauthorized" };
    }
    
    return { success: true, post: result[0] };
  } catch (error) {
    return { success: false, error: `Failed to update post: ${error}` };
  }
}

export async function deletePost(postId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getConnection();
    
    const result = await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)));

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to delete post: ${error}` };
  }
}

export async function getPost(postId: string) {
  try {
    const db = getConnection();
    
    const result = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    return null;
  }
}

export async function getUserPosts(userId: string, options: PaginationOptions) {
  const db = getConnection();
  
  const userPosts = await db
    .select({
      post: posts,
      author: users,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const totalCount = await db
    .select({ count: 1 })
    .from(posts)
    .where(eq(posts.userId, userId));

  return createPaginatedResult(
    userPosts,
    totalCount.length,
    options
  );
}

export async function getFeed(options: PostFeedOptions) {
  const db = getConnection();
  
  let query = db
    .select({
      post: posts,
      author: users,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id));

  if (options.hashtag) {
    query = query.where(ilike(posts.hashtags as any, `%${options.hashtag}%`));
  }

  const feedPosts = await query
    .orderBy(desc(posts.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  let totalQuery = db.select({ count: 1 }).from(posts);
  
  if (options.hashtag) {
    totalQuery = totalQuery.where(ilike(posts.hashtags as any, `%${options.hashtag}%`));
  }

  const totalCount = await totalQuery;

  return createPaginatedResult(
    feedPosts,
    totalCount.length,
    { limit: options.limit, offset: options.offset }
  );
}

export async function getPostsByHashtag(hashtag: string, options: PaginationOptions) {
  return getFeed({ hashtag, ...options });
}

export async function searchPosts(searchTerm: string, options: PaginationOptions) {
  const db = getConnection();
  
  const searchResults = await db
    .select({
      post: posts,
      author: users,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(ilike(posts.content, `%${searchTerm}%`))
    .orderBy(desc(posts.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const totalCount = await db
    .select({ count: 1 })
    .from(posts)
    .where(ilike(posts.content, `%${searchTerm}%`));

  return createPaginatedResult(
    searchResults,
    totalCount.length,
    options
  );
}