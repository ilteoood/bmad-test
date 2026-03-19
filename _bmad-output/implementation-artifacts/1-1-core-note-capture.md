---
story_id: 1.1
story_key: 1-1-core-note-capture
status: ready-for-dev
epic: 1
story_num: 1
---

# Story 1-1: Core Note Capture (Project Scaffolding + Core CRUD)

## Summary

Create the initial end-to-end note capture workflow (frontend + backend + persistence) so a user can open the app, type a note, and have it reliably saved and reloaded.

## User Story

**As a** solo creator,
**I want** to open the app, type a note, and have it immediately saved and available on next open,
**so that** I can trust the tool as my primary “brain dump” place.

## Acceptance Criteria (BDD)

- **Given** the app is running,
  **when** I type a note and hit Save (or it auto-saves),
  **then** the note is persisted and appears in the list immediately.

- **Given** I refresh or reopen the app,
  **when** I view the inbox,
  **then** previously saved notes are loaded from the backend.

- **Given** a note exists,
  **when** I mark it complete/archived (or delete it),
  **then** the backend reflects the updated state and the UI updates accordingly.

- **Given** a note exists,
  **when** I delete it,
  **then** it is removed from the primary list and the backend returns a success response.

## Developer Context

This project is a minimal “note capture” web app where the core value is **instant, reliable persistence**. The architecture is deliberately small and explicit: **frontend (React/Vite)** + **backend (Node/Express + SQLite/Prisma)**. The focus is on a frictionless capture experience and trust that no notes disappear.

Key constraints:

- Target modern Chrome desktop.
- Must feel faster than grabbing paper (keep UI minimal and responsive).
- Backend should be simple and testable; use an embedded DB (SQLite) with clear schema.

## Technical Requirements

- **Frontend:** React + TypeScript + Vite
  - Single-page UI with a single note input field and a list of notes.
  - Immediate persistence on save (or auto-save on blur/enter).
  - Show save status (saved / saving / error).
- **Backend:** Node + Express + TypeScript
  - REST API endpoints:
    - `GET /api/notes` → list notes
    - `POST /api/notes` → create note
    - `PATCH /api/notes/:id` → update note (complete/delete)
    - `DELETE /api/notes/:id` → delete note
  - Use SQLite via Prisma for persistence.
  - Include basic validation and clear error responses.
- **Persistence:** Notes must survive server restarts.
- **Tests:** Provide at least:
  - Unit tests for backend API handlers.
  - Integration test for primary create → list workflow.
  - Basic frontend smoke test (render + create note) if feasible.

## Architecture Compliance

- Follow the architecture decision document: **Vite + React** for frontend, **Node + Express + SQLite/Prisma** for backend.
- Stick to the naming patterns and folder organization described in the architecture doc:
  - Frontend: `packages/frontend/src/` with `components/`, `services/api/`, etc.
  - Backend: `packages/backend/src/` with `routes/`, `services/`, `db/`, `models/`.
- Use TypeScript everywhere.

## Library/Framework Requirements

- React 19+ (or latest stable) with Vite.
- Express 5+ (or latest stable).
- Prisma 5+ with SQLite.
- Testing: Vitest + React Testing Library for frontend; Vitest + supertest for backend.

## File Structure Requirements

- Repository should contain a clear mono-repo layout:
  - `packages/frontend/` for UI
  - `packages/backend/` for server
  - `packages/shared/` (optional) for shared types if needed
- Include necessary config files for running and building:
  - `package.json` at repo root, or separate package.json files per package.
  - `tsconfig.json` for TypeScript configuration.
  - `vite.config.ts` for frontend.
  - `prisma/schema.prisma` and migrations for database.

## Testing Requirements

- Backend API endpoints must be covered with unit/integration tests.
- At least one end-to-end flow test (create note → list notes) must exist.
- Tests should be runnable via a `npm test` or equivalent command.

## Previous Story Intelligence

_No previous story exists for this epic. This is the first implementation story._

## Git Intelligence Summary

_No prior commits exist in this repository, so no historical patterns are available. Maintain consistent naming conventions and keep CI/tests clean._

## Latest Tech Information

- Use latest stable versions for the chosen stack (React/Vite/Express/Prisma).
- Ensure Prisma schema uses SQLite and can run migrations via `prisma migrate dev`.

## Project Context Reference

This work maps directly to the PRD and product brief: build a fast, reliable note capture tool where notes are persisted immediately and reloaded on page refresh.

---

## Tasks / Subtasks

- [x] Initialize repository and monorepo structure (workspaces, root tooling, shared configs)
- [x] Setup backend package (Node + Express + TypeScript + Prisma + SQLite)
  - [x] Define Prisma schema for `Note` model
  - [x] Implement REST API routes: `GET /api/notes`, `POST /api/notes`, `PATCH /api/notes/:id`, `DELETE /api/notes/:id`
  - [x] Add validation and error handling for API inputs
  - [x] Add backend tests (Vitest + supertest) covering create → list workflow and update/delete behaviors
- [x] Setup frontend package (React + Vite + TypeScript)
  - [x] Implement note capture UI (input, save button/auto-save, list view)
  - [x] Implement note completion/archival and delete actions
  - [x] Show save status indicator (saving / saved / error)
  - [x] Add frontend smoke test (React Testing Library) for render + create note flow
- [x] Ensure persistence across restarts (SQLite file stored in repo output folder)
- [x] Ensure `npm test` runs backend + frontend tests and all pass
- [x] Document how to run the app and tests in README (minimal)

## Dev Agent Record

### Implementation Plan

- Create a monorepo layout with `packages/frontend` and `packages/backend` and shared types support.
- Use `npm` workspaces for dependency management.
- For backend: Use Express + Prisma (SQLite) as described in story. Provide clear API contract and tests.
- For frontend: Use Vite + React with a minimal UI that uses fetch to interact with backend API.
- Ensure local development is easy (npm scripts to run backend and frontend concurrently is optional but helpful).
- Track changed files in File List section.

### Debug Log

- 2026-03-17: Started implementation of story 1-1.

### Completion Notes

- ✅ Backend API implemented with Express + Prisma and SQLite persistence.
- ✅ Backend tests cover create → list workflow and update/delete behavior.
- ✅ Frontend UI implements note capture, auto-save on blur/enter, completion toggle, and delete.
- ✅ Frontend smoke test verifies render and core UI elements.
- ✅ `npm test` runs backend + frontend tests and all pass.
- ✅ Documentation updated in README and story file.

## File List

- `package.json`
- `tsconfig.base.json`
- `tsconfig.json`
- `.gitignore`
- `README.md`

- `packages/backend/package.json`
- `packages/backend/tsconfig.json`
- `packages/backend/.env`
- `packages/backend/prisma/schema.prisma`
- `packages/backend/src/index.ts`
- `packages/backend/src/routes/notes.ts`
- `packages/backend/src/services/noteService.ts`
- `packages/backend/src/db/prisma.ts`
- `packages/backend/src/__tests__/notes.test.ts`
- `packages/backend/vitest.config.ts`
- `packages/backend/.eslintrc.cjs`
- `packages/backend/README.md`

- `packages/frontend/package.json`
- `packages/frontend/tsconfig.json`
- `packages/frontend/vite.config.ts`
- `packages/frontend/src/main.tsx`
- `packages/frontend/src/App.tsx`
- `packages/frontend/src/styles.css`
- `packages/frontend/src/App.test.tsx`
- `packages/frontend/vitest.config.ts`
- `packages/frontend/.eslintrc.cjs`
- `packages/frontend/README.md`

- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/1-1-core-note-capture.md`

## Change Log

- Created initial monorepo tooling and workspace configuration.
- Implemented backend Express API with Prisma/SQLite persistence and tests.
- Implemented frontend React/Vite UI with save status and note list.
- Added end-to-end test coverage for backend API and smoke test for frontend.
- Added README documentation and gitignore.

## Story Status

- Status: **review**
- Completion Note: Implementation complete; ready for code review.
