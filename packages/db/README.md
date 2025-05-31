# @url4irl/db

Database abstraction layer with Drizzle ORM for URL4IRL. Supports PostgreSQL, MySQL, and SQLite.

## Installation

```bash
npm install @url4irl/db drizzle-orm
# Install your database driver
npm install postgres # for PostgreSQL
# OR
npm install mysql2 # for MySQL
# OR
npm install better-sqlite3 # for SQLite
```

## Setup

```typescript
import { createConnection } from '@url4irl/db';

// PostgreSQL
createConnection('postgresql://user:password@localhost:5432/dbname', 'postgres');

// MySQL
createConnection('mysql://user:password@localhost:3306/dbname', 'mysql');

// SQLite
createConnection('./database.db', 'sqlite');
```

## Environment Variables

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Schema

The package includes pre-defined schemas for:
- Users
- Posts
- Comments
- Follows
- Direct Messages
- Stars

## Usage

```typescript
import { getConnection, users, posts } from '@url4irl/db';
import { eq } from 'drizzle-orm';

const db = getConnection();

// Query users
const user = await db.select().from(users).where(eq(users.id, userId));

// Insert posts
const newPost = await db.insert(posts).values({
  id: 'post-id',
  userId: 'user-id',
  content: 'Hello, world!',
  createdAt: new Date(),
  updatedAt: new Date(),
});
```