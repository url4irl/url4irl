import { createConnection, getConnection } from '@url4irl/db'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Initialize connection for url4irl packages
export const db = createConnection(process.env.DATABASE_URL, 'postgres')

// Export the connection getter for use in components
export { getConnection }