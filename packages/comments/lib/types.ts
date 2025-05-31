import { Comment } from "@url4irl/db";

export interface CreateCommentData {
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentResult {
  success: boolean;
  comment?: Comment;
  error?: string;
}

export interface CommentThread {
  comment: Comment;
  author: any;
  replies: CommentThread[];
}