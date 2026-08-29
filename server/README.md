# VOID Server

Express backend for VOID Society — collects registrations and powers the hidden admin panel.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill `.env`:
- `DATABASE_URL` — Neon Postgres connection string (see below).
- `ADMIN_PASSWORD` — the password the `voidb` terminal command checks (default: `bee`).
- `AUTH_SECRET` — random secret for signing admin tokens (`openssl rand -hex 32`).

## Neon database

1. Create a project (or reuse one) in the Neon console.
2. Run the schema once:

```sql
CREATE TABLE IF NOT EXISTS registrations (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  branch        TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  whatsapp      TEXT NOT NULL,
  accommodation TEXT NOT NULL,
  screenshot    TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);
```

## Run

```bash
npm run dev    # http://localhost:8080
```

The frontend dev server (Vite, port 5173) proxies `/api` to this server automatically.

## API

| Method | Path                | Auth   | Description                              |
|--------|---------------------|--------|------------------------------------------|
| POST   | `/api/register`     | public | Multipart form + `screenshot` file; only `@kiet.edu` emails; rejects duplicates (409) |
| POST   | `/api/admin/login`  | public | `{ password }` → `{ token }` (rate-limited) |
| GET    | `/api/admin/verify` | Bearer | Validates an admin token                  |
| GET    | `/api/registrations`| Bearer | All registrations (newest first), screenshots as data URLs |

## Admin panel

On the frontend, the `/panel-sight` route shows the panel. Access it by running `voidb`
in the `/terminal` and entering the `ADMIN_PASSWORD`. The route and command are intentionally
not linked anywhere or listed in the terminal `help`.
