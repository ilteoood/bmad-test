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

## QA / CI

Run the full QA pipeline locally (mirrors CI):

```bash
npm run ci
```

## Containerized Development (Docker)

Start the full dev stack (frontend + backend) in Docker:

```bash
docker compose up --build
```

Then open the app at `http://localhost:5173`.

The backend API is available at `http://localhost:3000/api/notes`.
