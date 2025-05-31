import { Post } from "@url4irl/db";

export interface CreatePostData {
  userId: string;
  content: string;
  imageUrl?: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface UpdatePostData {
  content?: string;
  imageUrl?: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface PostResult {
  success: boolean;
  post?: Post;
  error?: string;
}

export interface PostFeedOptions {
  userId?: string;
  hashtag?: string;
  limit: number;
  offset: number;
}