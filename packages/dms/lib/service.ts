import { eq, and, or, desc, isNull, count } from "drizzle-orm";
import { getConnection, directMessages, users } from "@url4irl/db";
import { generateId, sanitizeContent, createPaginatedResult, PaginationOptions } from "@url4irl/core";
import { SendMessageData, MessageResult, Conversation } from "./types";

export async function sendMessage(data: SendMessageData): Promise<MessageResult> {
  try {
    const db = getConnection();
    
    const newMessage = {
      id: generateId(),
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: sanitizeContent(data.content),
      readAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(directMessages).values(newMessage).returning();
    
    return { success: true, message: result[0] };
  } catch (error) {
    return { success: false, error: `Failed to send message: ${error}` };
  }
}

export async function markMessageAsRead(messageId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getConnection();
    
    const result = await db
      .update(directMessages)
      .set({ readAt: new Date() })
      .where(and(
        eq(directMessages.id, messageId),
        eq(directMessages.receiverId, userId),
        isNull(directMessages.readAt)
      ));

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to mark message as read: ${error}` };
  }
}

export async function markConversationAsRead(currentUserId: string, otherUserId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getConnection();
    
    const result = await db
      .update(directMessages)
      .set({ readAt: new Date() })
      .where(and(
        eq(directMessages.senderId, otherUserId),
        eq(directMessages.receiverId, currentUserId),
        isNull(directMessages.readAt)
      ));

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to mark conversation as read: ${error}` };
  }
}

export async function getConversation(user1Id: string, user2Id: string, options: PaginationOptions) {
  const db = getConnection();
  
  const messages = await db
    .select({
      message: directMessages,
      sender: users,
    })
    .from(directMessages)
    .innerJoin(users, eq(directMessages.senderId, users.id))
    .where(or(
      and(eq(directMessages.senderId, user1Id), eq(directMessages.receiverId, user2Id)),
      and(eq(directMessages.senderId, user2Id), eq(directMessages.receiverId, user1Id))
    ))
    .orderBy(desc(directMessages.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const totalCount = await db
    .select({ count: count() })
    .from(directMessages)
    .where(or(
      and(eq(directMessages.senderId, user1Id), eq(directMessages.receiverId, user2Id)),
      and(eq(directMessages.senderId, user2Id), eq(directMessages.receiverId, user1Id))
    ));

  return createPaginatedResult(
    messages,
    totalCount[0].count,
    options
  );
}

export async function getConversations(userId: string, options: PaginationOptions): Promise<Conversation[]> {
  const db = getConnection();
  
  const conversations = await db
    .select({
      message: directMessages,
      otherUser: users,
    })
    .from(directMessages)
    .innerJoin(users, or(
      and(eq(directMessages.senderId, users.id), eq(directMessages.receiverId, userId)),
      and(eq(directMessages.receiverId, users.id), eq(directMessages.senderId, userId))
    ))
    .where(or(
      eq(directMessages.senderId, userId),
      eq(directMessages.receiverId, userId)
    ))
    .orderBy(desc(directMessages.createdAt))
    .limit(options.limit)
    .offset(options.offset);

  const conversationMap = new Map<string, Conversation>();
  
  for (const conv of conversations) {
    const otherUserId = conv.message.senderId === userId ? conv.message.receiverId : conv.message.senderId;
    
    if (!conversationMap.has(otherUserId)) {
      const unreadCount = await getUnreadCount(userId, otherUserId);
      
      conversationMap.set(otherUserId, {
        participantId: otherUserId,
        participant: conv.otherUser,
        lastMessage: conv.message,
        unreadCount,
      });
    }
  }
  
  return Array.from(conversationMap.values());
}

export async function getUnreadCount(userId: string, fromUserId?: string): Promise<number> {
  try {
    const db = getConnection();
    
    let query = db
      .select({ count: count() })
      .from(directMessages)
      .where(and(
        eq(directMessages.receiverId, userId),
        isNull(directMessages.readAt)
      ));

    if (fromUserId) {
      query = query.where(and(
        eq(directMessages.receiverId, userId),
        eq(directMessages.senderId, fromUserId),
        isNull(directMessages.readAt)
      ));
    }

    const result = await query;
    return result[0].count;
  } catch (error) {
    return 0;
  }
}