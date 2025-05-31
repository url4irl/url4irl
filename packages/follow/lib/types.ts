import { Follow } from "@url4irl/db";

export interface FollowResult {
  success: boolean;
  follow?: Follow;
  error?: string;
}

export interface UnfollowResult {
  success: boolean;
  error?: string;
}

export interface FollowStats {
  followers: number;
  following: number;
}