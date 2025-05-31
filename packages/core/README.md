# @url4irl/core

Core types, utilities, and interfaces for URL4IRL packages.

## Installation

```bash
npm install @url4irl/core
```

## Features

- Common TypeScript interfaces for all entities
- Utility functions for ID generation, validation, and pagination
- Shared types and constants

## Usage

```typescript
import { User, Post, generateId, validateEmail, createPaginatedResult } from '@url4irl/core';

// Generate unique IDs
const userId = generateId();

// Validate email addresses
const isValid = validateEmail('user@example.com');

// Create paginated results
const result = createPaginatedResult(data, total, { limit: 10, offset: 0 });
```

## Types

- `User` - User entity interface
- `Post` - Post entity interface
- `Comment` - Comment entity interface
- `Follow` - Follow relationship interface
- `DirectMessage` - Direct message interface
- `Star` - Star/like interface
- `PaginationOptions` - Pagination parameters
- `PaginatedResult<T>` - Paginated response wrapper