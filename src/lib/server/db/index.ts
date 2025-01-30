import { env } from '$env/dynamic/private';

import * as schema from './schema';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = new Database(env.DATABASE_URL);
export const db = drizzle(client, { schema });
migrate(db, { migrationsFolder: 'drizzle' });
