export type DatabaseType = 'postgres' | 'mysql' | 'sqlite';

export interface DatabaseConfig {
  url: string;
  type: DatabaseType;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}