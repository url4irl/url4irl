import { DirectMessage } from "@url4irl/db";

export interface SendMessageData {
  senderId: string;
  receiverId: string;
  content: string;
}

export interface MessageResult {
  success: boolean;
  message?: DirectMessage;
  error?: string;
}

export interface Conversation {
  participantId: string;
  participant: any;
  lastMessage: DirectMessage;
  unreadCount: number;
}