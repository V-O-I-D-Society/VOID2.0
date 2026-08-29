import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { config } from './config.js';
import { router } from './routes.js';
import { query } from './db.js';

// Heartbeat: keeps the Neon compute awake so the first request after idle
// doesn't pay a 4-10s cold-start (free-tier Neon suspends after ~5 min idle).
setInterval(() => {
  query('SELECT 1').catch(() => {});
}, 2 * 60 * 1000);

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.frontendOrigin }));
app.use(express.json());

app.use('/api', router);

// 404 for unknown API routes.
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// Centralized error handler.
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 5MB).' : 'File upload error.';
    return res.status(400).json({ error: message });
  }
  if (err && err.message === 'Only image files are allowed.') {
    return res.status(422).json({ error: err.message });
  }
  console.error('unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
});

app.listen(config.port, () => {
  console.log(`VOID server listening on http://localhost:${config.port}`);
});
