export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
}

export interface Post extends BaseEntity {
  userId: string;
  content: string;
  imageUrl?: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface Comment extends BaseEntity {
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
}

export interface Follow extends BaseEntity {
  followerId: string;
  followingId: string;
}

export interface DirectMessage extends BaseEntity {
  senderId: string;
  receiverId: string;
  content: string;
  readAt?: Date;
}

export interface Star extends BaseEntity {
  userId: string;
  postId: string;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}