import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const required = ['DATABASE_URL', 'ADMIN_PASSWORD', 'AUTH_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

export const config = {
  port: Number(process.env.PORT || 8080),
  databaseUrl: process.env.DATABASE_URL,
  adminPassword: process.env.ADMIN_PASSWORD,
  authSecret: process.env.AUTH_SECRET,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  tokenTtlMs: 60 * 60 * 1000, // 1h
};
