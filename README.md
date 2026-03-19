# bmad-test

This repository is a minimal note capture web app (frontend + backend) built using:

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node + Express + TypeScript + Prisma + SQLite

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run backend:

   ```bash
   npm --workspace packages/backend run dev
   ```

3. Run frontend (in a separate terminal):
   ```bash
   npm --workspace packages/frontend run dev
   ```

The frontend proxies `/api` requests to the backend on `http://localhost:3000`.

## Tests

- Backend: `npm --workspace packages/backend test`
- Frontend: `npm --workspace packages/frontend test`
