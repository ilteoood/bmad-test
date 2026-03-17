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

## Story Status
- Status: **ready-for-dev**
- Completion Note: Ultimate context engine analysis completed - comprehensive developer guide created.
