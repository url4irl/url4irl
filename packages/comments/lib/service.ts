import { eq, and, isNull, desc, count } from "drizzle-orm";
import { getConnection, comments, users } from "@url4irl/db";
import { generateId, sanitizeContent, createPaginatedResult, PaginationOptions } from "@url4irl/core";
import { CreateCommentData, UpdateCommentData, CommentResult, CommentThread } from "./types";

export async function createComment(data: CreateCommentData): Promise<CommentResult> {
  try {
    const db = getConnection();
    
    const newComment = {
      id: generateId(),
      postId: data.postId,
      userId: data.userId,
      content: sanitizeContent(data.content),
      parentCommentId: data.parentCommentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(comments).values(newComment).returning();
    
    return { success: true, comment: result[0] };
  } catch (error) {
    return { success: false, error: `Failed to create comment: ${error}` };
  }
}

export async function updateComment(commentId: string, userId: string, data: UpdateCommentData): Promise<CommentResult> {
  try {
    const db = getConnection();
    
    const result = await db
      .update(comments)
      .set({
        content: sanitizeContent(data.content),
        updatedAt: new Date(),
      })
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Comment not found or unauthorized" };
    }
    
    return { success: true, comment: result[0] };
  } catch (error) {
    return { success: false, error: `Failed to update comment: ${error}` };
  }
}

export async function deleteComment(commentId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getConnection();
    
    const result = await db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to delete comment: ${error}` };
  }
}

export async function getComment(commentId: string) {
  try {
    const db = getConnection();
    
    const result = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.id, commentId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    return null;
  }
}

export async function getPostComments(postId: string, options: PaginationOptions) {
  const db = getConnection();
  
  const postComments = await db
    .select({
      comment: comments,
      author: users,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(and(eq(comments.postId, postId), isNull(comments.parentCommentId)))
    .orderBy(desc(comments.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const totalCount = await db
    .select({ count: count() })
    .from(comments)
    .where(and(eq(comments.postId, postId), isNull(comments.parentCommentId)));

  return createPaginatedResult(
    postComments,
    totalCount[0].count,
    options
  );
}

export async function getCommentReplies(parentCommentId: string, options: PaginationOptions) {
  const db = getConnection();
  
  const replies = await db
    .select({
      comment: comments,
      author: users,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.parentCommentId, parentCommentId))
    .orderBy(desc(comments.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const totalCount = await db
    .select({ count: count() })
    .from(comments)
    .where(eq(comments.parentCommentId, parentCommentId));

  return createPaginatedResult(
    replies,
    totalCount[0].count,
    options
  );
}

export async function getCommentThread(commentId: string): Promise<CommentThread | null> {
  try {
    const commentData = await getComment(commentId);
    if (!commentData) return null;

    const replies = await getCommentReplies(commentId, { limit: 100, offset: 0 });
    
    const repliesWithThreads: CommentThread[] = await Promise.all(
      replies.data.map(async (reply) => {
        const nestedReplies = await getCommentThread(reply.comment.id);
        return {
          comment: reply.comment,
          author: reply.author,
          replies: nestedReplies ? [nestedReplies] : [],
        };
      })
    );

    return {
      comment: commentData.comment,
      author: commentData.author,
      replies: repliesWithThreads,
    };
  } catch (error) {
    return null;
  }
}

export async function getCommentCount(postId: string): Promise<number> {
  try {
    const db = getConnection();
    
    const result = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.postId, postId));

    return result[0].count;
  } catch (error) {
    return 0;
  }
}