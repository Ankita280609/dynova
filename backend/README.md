# Dynova Backend

Minimal Node/Express backend for Dynova with MongoDB (Mongoose) and JWT auth.

Quick start

1. Copy `.env.example` to `.env` and fill values (MONGO_URI, JWT_SECRET, PORT).
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in development:

```bash
npm run dev
```

API
- POST /api/auth/signup  { name, email, password }
- POST /api/auth/signin  { email, password }
- GET  /api/auth/me      (Authorization: Bearer <token>)

Notes
- This is a minimal scaffold intended for local development and testing. For production, add input validation, rate limiting, HTTPS, secure cookie handling, and persistent session storage as needed.
