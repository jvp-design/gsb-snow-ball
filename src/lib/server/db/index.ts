import * as schema from './schema';

import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg, { type PoolConfig } from 'pg';

const { Pool } = pkg;

dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Create the directory path if it doesn't exist
function get_config() {
	// @type import("pg").PoolConfig
	const object: PoolConfig = {
		connectionString: process.env.DATABASE_URL
	};
	return object;
}

export const pool = new Pool(get_config());
export const db = drizzle(pool, { schema });
migrate(db, { migrationsFolder: 'drizzle' });
