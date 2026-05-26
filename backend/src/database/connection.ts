import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[DB] Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('[DB] Query error', { text, error });
    throw error;
  }
}

export async function getClient() {
  return await pool.connect();
}

export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('[DB] Connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('[DB] Connection test failed:', error);
    return false;
  }
}
