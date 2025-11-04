import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// ✅ Load environment variables from .env at project root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// ✅ Debug: print the database URL (without credentials)
const safeUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/:\/\/.*@/, '://***@')
  : 'not set';
console.log('✅ DATABASE_URL loaded in ormconfig.ts:', safeUrl);

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL missing from .env file');
}

if (!process.env.DB_SCHEMA) {
  console.warn('⚠️ DB_SCHEMA not found in .env, defaulting to "public"');
}

// ✅ Full configuration for Aiven PostgreSQL
const ormconfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Aiven SSL
  },
  schema: process.env.DB_SCHEMA || 'public',
  synchronize: false, // ⚠️ set false for production-safe schema (no auto ALTER TABLE)
  migrationsRun: true, // automatically runs pending migrations
  logging: true,
  entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
  extra: {
    max: 10, // optional connection pool size
    connectionTimeoutMillis: 10000,
  },
};

export default ormconfig;



