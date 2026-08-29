import pg from 'pg';
import { config } from './config.js';

const isLocal = config.databaseUrl.includes('localhost');

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);
