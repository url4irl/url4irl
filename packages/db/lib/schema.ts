import { sql } from "drizzle-orm";
import { text, timestamp, pgTable, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).unique(),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  hashtags: text("hashtags").array(),
  mentions: text("mentions").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  postId: varchar("post_id", { length: 255 }).notNull().references(() => posts.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  content: text("content").notNull(),
  parentCommentId: varchar("parent_comment_id", { length: 255 }).references(() => comments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: varchar("id", { length: 255 }).primaryKey(),
  followerId: varchar("follower_id", { length: 255 }).notNull().references(() => users.id),
  followingId: varchar("following_id", { length: 255 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const directMessages = pgTable("direct_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  senderId: varchar("sender_id", { length: 255 }).notNull().references(() => users.id),
  receiverId: varchar("receiver_id", { length: 255 }).notNull().references(() => users.id),
  content: text("content").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stars = pgTable("stars", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  postId: varchar("post_id", { length: 255 }).notNull().references(() => posts.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Follow = typeof follows.$inferSelect;
export type NewFollow = typeof follows.$inferInsert;
export type DirectMessage = typeof directMessages.$inferSelect;
export type NewDirectMessage = typeof directMessages.$inferInsert;
export type Star = typeof stars.$inferSelect;
export type NewStar = typeof stars.$inferInsert;