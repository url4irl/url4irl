import { describe, it, expect } from 'vitest';
import { generateId, validateEmail, sanitizeContent, createPaginatedResult } from './utils';

describe('Utils', () => {
  describe('generateId', () => {
    it('should generate a unique string ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTypeOf('string');
      expect(id2).toBeTypeOf('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(10);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('sanitizeContent', () => {
    it('should trim whitespace and normalize spaces', () => {
      expect(sanitizeContent('  hello   world  ')).toBe('hello world');
      expect(sanitizeContent('text\n\nwith\t\ttabs')).toBe('text with tabs');
      expect(sanitizeContent('   ')).toBe('');
    });
  });

  describe('createPaginatedResult', () => {
    it('should create paginated result with hasMore true when there are more items', () => {
      const data = [1, 2, 3];
      const total = 10;
      const options = { limit: 3, offset: 0 };
      
      const result = createPaginatedResult(data, total, options);
      
      expect(result.data).toEqual(data);
      expect(result.total).toBe(total);
      expect(result.hasMore).toBe(true);
    });

    it('should create paginated result with hasMore false when no more items', () => {
      const data = [1, 2, 3];
      const total = 3;
      const options = { limit: 5, offset: 0 };
      
      const result = createPaginatedResult(data, total, options);
      
      expect(result.data).toEqual(data);
      expect(result.total).toBe(total);
      expect(result.hasMore).toBe(false);
    });
  });
});