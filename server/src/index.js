import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
  console.error('unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
});

app.listen(config.port, () => {
  console.log(`VOID server listening on http://localhost:${config.port}`);
});
