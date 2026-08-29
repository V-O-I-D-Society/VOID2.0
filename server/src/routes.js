import { Router } from 'express';
import multer from 'multer';
import { query } from './db.js';
import { validateRegistration } from './validate.js';
import { loginHandler, requireAdmin } from './auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

const toBase64DataUrl = (buf, mimetype) => `data:${mimetype};base64,${buf.toString('base64')}`;

export const router = Router();

// Public: submit a registration.
router.post('/register', upload.single('screenshot'), async (req, res) => {
  const fields = {
    name: (req.body.name || '').trim(),
    branch: (req.body.branch || '').trim(),
    email: String(req.body.email || '').trim().toLowerCase(),
    whatsapp: (req.body.whatsapp || '').trim(),
    accommodation: (req.body.accommodation || '').trim(),
  };

  const errors = validateRegistration(fields);
  if (!req.file) errors.screenshot = 'Payment screenshot is required.';
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  const screenshot = toBase64DataUrl(req.file.buffer, req.file.mimetype);

  try {
    const result = await query(
      `INSERT INTO registrations (name, branch, email, whatsapp, accommodation, screenshot)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [fields.name, fields.branch, fields.email, fields.whatsapp, fields.accommodation, screenshot],
    );
    if (!result.rowCount) {
      return res.status(409).json({ errors: { email: 'This email is already registered.' } });
    }
    return res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('register insert failed:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin auth.
router.post('/admin/login', loginHandler);
router.get('/admin/verify', requireAdmin, (_req, res) => res.json({ valid: true }));

// Admin only: list all registrations.
router.get('/registrations', requireAdmin, async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, name, branch, email, whatsapp, accommodation, screenshot, created_at
       FROM registrations
       ORDER BY created_at DESC`,
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('list registrations failed:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
