import { Star } from "@url4irl/db";

export interface StarResult {
  success: boolean;
  star?: Star;
  error?: string;
}

export interface UnstarResult {
  success: boolean;
  error?: string;
}