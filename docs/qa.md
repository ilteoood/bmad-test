# QA Checklist

This document summarizes the QA and developer verification steps for the project.

## Local QA (Fast Path)

### 1) Install dependencies

```bash
npm install
```

### 2) Run lint + unit tests

```bash
npm run lint
npm test
```

### 3) Run end-to-end tests

```bash
npm run e2e
```

## Full CI-like run

```bash
npm run ci
```

This runs the same sequence as the CI pipeline:

- install dependencies (if needed)
- run lint
- run unit tests
- run end-to-end tests

## Containerized Development (Docker)

### Start development environment

```bash
docker compose up --build
```

Then open the app at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/notes

### Stop

```bash
docker compose down
```

### Notes

- The backend SQLite database is persisted in `_bmad-output/data/dev.db`.
- The frontend is served by Vite and proxies `/api` to the backend.
