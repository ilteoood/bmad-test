# Frontend (React + Vite)

## Setup

1. Install dependencies from repo root:

   ```bash
   npm install
   ```

2. Start the backend (needed for the frontend proxy):

   ```bash
   npm --workspace packages/backend run dev
   ```

3. Start the frontend:
   ```bash
   npm --workspace packages/frontend run dev
   ```

## Development

- The frontend is configured to proxy `/api` requests to `http://localhost:3000`.
- The app runs at `http://localhost:5173` by default.

## Tests

- Run all frontend tests:
  ```bash
  npm --workspace packages/frontend test
  ```
