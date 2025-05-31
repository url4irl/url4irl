import { drizzle } from "drizzle-orm/postgres-js";
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export type DbConnection = ReturnType<typeof drizzle> | ReturnType<typeof drizzleMysql> | ReturnType<typeof drizzleSqlite>;

let db: DbConnection | null = null;

export function createConnection(databaseUrl: string, dbType: 'postgres' | 'mysql' | 'sqlite' = 'postgres'): DbConnection {
  if (db) {
    return db;
  }

  switch (dbType) {
    case 'postgres': {
      const postgres = require('postgres');
      const sql = postgres(databaseUrl);
      db = drizzle(sql, { schema });
      break;
    }
    case 'mysql': {
      const mysql = require('mysql2/promise');
      const connection = mysql.createConnection(databaseUrl);
      db = drizzleMysql(connection, { schema });
      break;
    }
    case 'sqlite': {
      const Database = require('better-sqlite3');
      const sqlite = new Database(databaseUrl);
      db = drizzleSqlite(sqlite, { schema });
      break;
    }
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }

  return db;
}

export function getConnection(): DbConnection {
  if (!db) {
    throw new Error('Database connection not initialized. Call createConnection first.');
  }
  return db;
}