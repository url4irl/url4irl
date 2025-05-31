import { PaginatedResult, PaginationOptions } from "./types";

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> {
  const hasMore = options.offset + options.limit < total;
  
  return {
    data,
    total,
    hasMore,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeContent(content: string): string {
  return content.trim().replace(/\s+/g, ' ');
}