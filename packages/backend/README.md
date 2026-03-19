# Backend (Node + Express + Prisma)

## Setup

1. Install dependencies from repo root:

   ```bash
   npm install
   ```

2. Run Prisma migrations (creates SQLite DB at `_bmad-output/data/dev.db`):
   ```bash
   npx prisma migrate dev --name init
   ```

## Run

- Start in development mode:

  ```bash
  npm --workspace packages/backend run dev
  ```

- Build + start:
  ```bash
  npm --workspace packages/backend run build
  npm --workspace packages/backend start
  ```

## API

- `GET /api/notes` - list notes
- `POST /api/notes` - create note `{ content: string }`
- `PATCH /api/notes/:id` - update note (`content`, `completed`, `deleted`)
- `DELETE /api/notes/:id` - soft-delete note
