# Next.js Social App Example

This is an example Next.js application that demonstrates how to use the url4irl packages to build a social networking app.

## Features

- User authentication (register/login)
- Create and view posts
- User profiles
- Follow/unfollow users
- Like posts
- Comment on posts
- Feed with pagination

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: url4irl packages
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and JWT secret.

3. Set up the database:
   ```bash
   # Generate migration files
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

You need a PostgreSQL database running. You can use Docker:

```bash
docker run --name url4irl-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=url4irl_example \
  -p 5432:5432 \
  -d postgres:15
```

Then update your `.env` file:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/url4irl_example"
```

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and configurations
- `src/types/` - TypeScript type definitions

## url4irl Packages Used

- `@url4irl/auth` - Authentication
- `@url4irl/core` - Core utilities
- `@url4irl/db` - Database schema and connection
- `@url4irl/posts` - Post management
- `@url4irl/users` - User management
- `@url4irl/comments` - Comment functionality
- `@url4irl/follow` - Follow/unfollow functionality
- `@url4irl/stars` - Like/star functionality