import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { ApiClient } from '../entities/api-client.entity';

config();

const schema = process.env.DATABASE_SCHEMA ?? 'public';
const rawDatabaseUrl = process.env.DATABASE_URL ?? '';

export function resolvePostgresConnection(url: string): {
  url: string;
  ssl: false | { rejectUnauthorized: boolean };
} {
  if (process.env.DATABASE_SSL === 'false') {
    return { url, ssl: false };
  }

  const needsSsl =
    process.env.DATABASE_SSL === 'true' ||
    url.includes('sslmode=require') ||
    url.includes('supabase.com');

  if (!needsSsl) {
    return { url, ssl: false };
  }

  const cleanUrl = url
    .replace(/([?&])sslmode=[^&]*&?/, '$1')
    .replace(/[?&]$/, '');

  return {
    url: cleanUrl,
    ssl: { rejectUnauthorized: false },
  };
}

const { url: databaseUrl, ssl } = resolvePostgresConnection(rawDatabaseUrl);

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  schema,
  entities: [ApiClient],
  migrations: ['src/migrations/*.ts'],
  ssl,
});
