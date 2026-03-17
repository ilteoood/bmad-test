---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-07-validation
inputDocuments:
  - "/Users/ilteoood/Documents/git/personal/bmad-test/_bmad-output/planning-artifacts/prd.md"
  - "/Users/ilteoood/Documents/git/personal/bmad-test/_bmad-output/planning-artifacts/product-brief-bmad-test-2026-03-17.md"
workflowType: 'architecture'
project_name: 'bmad-test'
user_name: 'iLTeoooD'
date: '2026-03-17'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- Core note capture CRUD (create, list, edit/complete, delete, undo restore).
- Capture workflow must be extremely fast and frictionless (open → type → save in one action, target ≤ 5 seconds).
- UI must provide clear feedback for note state (saved, pending sync, failed).
- Support offline capture with local queueing and automatic resync when connectivity returns.
- Provide undo/restore for deletions.
- Ensure keyboard-first operation (focus on input, keyboard save/delete/undo).

**Non-Functional Requirements:**
- Performance: UI actions must feel instant; backend API responses should be <200ms (normal load).
- Reliability: No data loss; notes must persist across reloads and browser restarts; local cache + sync must preserve notes.
- Availability: Backend should be highly available (≥99.9%).
- Accessibility: Key interactions must work without a mouse, and focus management must be solid.

### Scale & Complexity

- **Project complexity:** Medium (core MVP is small, but reliability/ offline sync increases architectural scope).
- **Primary domain:** Full-stack web application (SPA frontend + backend API).
- **Cross-cutting concerns:**
  - Offline persistence + sync reliability.
  - Data durability and trust (never lose notes).
  - Fast capture performance and minimal UI friction.
  - Clear user trust signals (state, undo, local caching).

### Technical Constraints & Dependencies

- Must run in a modern browser (target: latest Chrome desktop).
- Backend must support CRUD operations with clear success/failure contracts.
- Local storage (IndexedDB/localStorage) required for offline support.
- No real-time collaboration or multi-user sync required for MVP.

### Cross-Cutting Concerns Identified

- **Data durability:** Ensure notes are not lost under any normal usage scenario (network issues, reloads).
- **Sync mechanism:** Robust retry strategy and clear user feedback is required for offline/unstable networks.
- **User trust:** The system must minimize uncertainty about whether a note is saved.
- **Minimal UI friction:** The app needs to feel as fast and easy as paper to capture thoughts.

---

## Starter Template Evaluation

### Primary Technology Domain
- Full-stack web application (SPA frontend + backend API)
- Target: modern desktop browser (latest Chrome)

### Starter Options Considered

#### Option 1 — Minimal split frontend + backend (Vite + React / Node + Express)
- Pros: lightweight, explicit frontend/backend separation, easy to reason about.
- Cons: requires manual wiring (CORS, concurrency), more setup for local dev.

#### Option 2 — Full-stack starter (Next.js / T3 stack)
- Pros: single repo, built-in API routes, common best practices baked in.
- Cons: more opinionated and heavier; some Next.js conventions not required for a simple SPA.

#### Option 3 — Backend-first microservice starter (Fastify/Nest)
- Pros: strong API structure, validation, scalable backend patterns.
- Cons: heavier backend setup; still need separate frontend.

### Recommended Starter
**Selected starter:** Vite + React + TypeScript (frontend) + Node/Express + SQLite (backend)

**Rationale:**
- Aligns with “fast, minimal, frictionless” capture workflow.
- Keeps both frontend and backend small and transparent.
- Allows explicit offline-sync handling in the frontend.
- Easy to extend later with auth, sync, or multi-device support.

### Starter Architectural Decisions Provided

**Language & Runtime:**
- TypeScript everywhere (frontend + backend)
- Node.js for server runtime

**Styling:**
- Recommend Tailwind CSS for rapid, minimal UI styling (optional plain CSS for the leanest footprint)

**Build tooling:**
- Vite for frontend dev server and build
- nodemon/ts-node-dev for backend dev loop

**Testing:**
- Frontend: Vitest + React Testing Library
- Backend: Vitest/Jest + supertest

**Code Organization:**
- Frontend: `src/` with `components/`, `hooks/`, `services/api/`
- Backend: `src/` with `routes/`, `services/`, `db/`, `models/`

**Offline/Sync Strategy (early architecture):**
- Local cache via IndexedDB (e.g., `idb` or `localForage`)
- Sync queue + retry logic in frontend service layer
- UI states: `synced`, `pending`, `failed`

---

**Next step:** We are ready to proceed with concrete architectural decisions and starter setup.

## Core Architectural Decisions

### Category: Data Architecture

**Context:** The starter choice leans toward **SQLite** (file-based) paired with a Node/Express API. This matches the “simple, reliable, and local-first” requirements.

**Decision needed:** Confirm database approach and data modeling strategy.

**Options:**

1. **SQLite + Prisma (ORM)**
   - Pros: type-safe models, migrations, easy schema evolution.
   - Cons: adds dependency and generation step.

2. **SQLite + direct SQL (e.g., `better-sqlite3`)**
   - Pros: minimal dependencies, direct control.
   - Cons: manual query construction, no schema tooling.

3. **In-memory JSON (no DB) with file persistence**
   - Pros: simplest for MVP; minimal overhead.
   - Cons: harder to scale, risk of corruption, less predictable for concurrency.

4. **Postgres (or other server DB)**
   - Pros: scales beyond MVP; aligns with typical production setups.
   - Cons: heavier setup, more configuration and infra.

**Suggested for MVP:** **SQLite + Prisma**, because it keeps setup simple while giving a solid schema/migration path and type safety.

---

## Implementation Patterns & Consistency Rules

### Overview
Multiple AI agents working on the same codebase can make inconsistent decisions unless we define explicit patterns. This section captures the key areas where divergence is likely and proposes rules to keep implementations aligned.

### Potential Conflict Points

**Naming Conflicts**
- Database table/column naming
- API endpoint naming patterns
- File and directory naming
- Component/function/variable naming
- Route parameter formats

**Structural Conflicts**
- Test location (co‑located vs central `tests/` folder)
- Component/module organization (feature vs type)
- Utilities/helpers placement
- Configuration file layout
- Static asset organization

**Format Conflicts**
- API response wrappers and error formats
- Date/time formats (ISO vs epoch)
- JSON field naming conventions (camelCase vs snake_case)
- Status code usage patterns

**Communication Conflicts**
- Event naming conventions
- Event payload structure
- State update patterns (immutable vs mutable)
- Logging formats and levels

**Process Conflicts**
- Loading state handling patterns
- Error recovery / retries
- Validation timing (client-side vs server-side)

---

### Suggested Consistency Rules (Draft)

#### Naming Patterns

**Database Naming**
- Tables: **plural, snake_case** (e.g., `notes`).
- Columns: **snake_case** (e.g., `created_at`, `updated_at`).
- Foreign keys: `{entity}_id`.

**API Naming**
- REST endpoints: **plural** resources (e.g., `/notes`).
- Route parameters: `:id` (e.g., `/notes/:id`).
- Query params: **camelCase** (e.g., `pageSize`).

**Code Naming**
- Files: **kebab-case** for components & utilities (e.g., `note-card.tsx`).
- Components: **PascalCase** (e.g., `NoteCard`).
- Functions/variables: **camelCase** (e.g., `saveNote`).

---

### Decision: Data Architecture (Chosen)

✅ **Selected for MVP:** **SQLite + Prisma** (type-safe schema + migrations + minimal infra)

**Rationale:** This delivers strong schema guarantees, easy migrations, and keeps the implementation straightforward while providing a clear path to scale if needed.

---

## Project Structure & Boundaries

### Mapping Requirements to Components

**Core Requirements (note capture + persistence)**
- **Frontend capture UI** → `packages/frontend/src/components/`, `packages/frontend/src/services/` (offline sync, API client)
- **Backend note API** → `packages/backend/src/routes/notes.ts`, `packages/backend/src/services/noteService.ts`, `packages/backend/src/db/` (Prisma models + migrations)
- **Offline queue + sync** → `packages/frontend/src/services/sync/` + `packages/frontend/src/lib/storage.ts`

**Reliability & trust (offline/health)**
- **Health endpoints** → `packages/backend/src/routes/health.ts`
- **Docker health checks** → `docker-compose.yml` + container `HEALTHCHECK`

**QA & testing**
- **Unit tests** → `packages/frontend/src/__tests__/`, `packages/backend/src/__tests__/`
- **Integration tests** → `packages/backend/test/integration/`
- **E2E tests** → `e2e/` (Playwright)

---

### Proposed Project Directory Structure

```
project-root/
├── .gitignore
├── README.md
├── docker-compose.yml
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── packages/
│   ├── frontend/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   │   ├── NoteInput.tsx
│   │   │   │   ├── NoteList.tsx
│   │   │   │   └── ...
│   │   │   ├── services/
│   │   │   │   ├── api.ts
│   │   │   │   ├── sync.ts
│   │   │   │   └── storage.ts
│   │   │   ├── hooks/
│   │   │   └── styles/
│   │   ├── public/
│   │   ├── vitest.config.ts
│   │   └── ...
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── routes/
│   │   │   │   ├── notes.ts
│   │   │   │   └── health.ts
│   │   │   ├── services/
│   │   │   │   ├── noteService.ts
│   │   │   │   └── syncService.ts
│   │   │   ├── db/
│   │   │   │   ├── prisma.ts
│   │   │   │   └── schema.prisma
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── ...
├── e2e/
│   ├── playwright.config.ts
│   ├── tests/
│   └── fixtures/
└── scripts/
    ├── dev.sh
    ├── start.sh
    └── test.sh
```

### Architectural Boundaries

**API Boundaries**
- Frontend communicates with backend via REST API under `/api/notes`
- Backend exposes `/health` for container health checks
- Database access is isolated behind the `noteService` layer

**Component Boundaries**
- Frontend is responsible for UI + offline queue + sync logic
- Backend is responsible for persistence, validation, and health status
- Shared types (Note DTO) live in a shared package or `packages/shared/` if needed

**Data Boundaries**
- Persistent data stored in SQLite via Prisma
- Sync queue stored in IndexedDB/localStorage, with in-memory state in frontend
- No external data integrations required for MVP

---

### What would you like to do next?

- **[A] Advanced Elicitation** — explore alternative project organizations (monorepo vs single repo, “feature folders”, package boundaries)
- **[P] Party Mode** — bring multiple perspectives to validate the proposed structure
- **[C] Continue** — lock in this structure and move to validation (step 7)

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- The chosen stack (Vite/React + Node/Express + SQLite/Prisma) is compatible and common in modern full-stack TypeScript monorepos.
- Docker + Compose orchestration fits the stack and supports both dev and production runs.
- Naming, formatting, and pattern conventions align with the stack.

**Pattern Consistency:**
- Naming conventions and folder conventions are consistent and aligned with the technology choices.
- The API contract (REST + JSON) matches the frontend sync patterns.
- Structure supports the offline sync patterns and health check requirements.

**Structure Alignment:**
- The project tree supports the architectural decisions (client/server separation, shared types, test locations).
- Boundaries are clear between frontend UI, backend API, and persistence layer.
- Integration points (API routes, health endpoint, sync service) are explicitly mapped.

---

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
- Core capture, persistence, and sync requirements are mapped to frontend services and backend APIs.
- Offline and health-check requirements are addressed via local storage strategy and `/health` endpoint.
- Undo/restore and delete flows are supported by backend delete endpoints and frontend UI patterns.

**Non-Functional Requirements Coverage:**
- Performance: Vite + React provides fast load; backend is lightweight (Express + SQLite).
- Reliability: persistence via SQLite + local caching (IndexedDB/LocalStorage) addresses data durability.
- Accessibility: included as a stated requirement and can be validated via WCAG audits.
- Devops: Docker + Compose addresses deployment and environment consistency.

---

### Implementation Readiness Validation ✅

**Decision Completeness:**
- Critical decisions are documented (stack, DB, naming conventions, patterns).
- Versions are not pinned yet; this is OK for planning, but should be verified when scaffolding.

**Structure Completeness:**
- Project tree is concrete and maps requirements to directories.
- Integration points are clear and mapped to files/services.

**Pattern Completeness:**
- Naming conventions and key conflict points are covered.
- Communication and error-handling patterns have a baseline (REST, JSON, status codes).

---

### Gap Analysis Results

**Critical Gaps:**
- No critical gaps found. All core requirements map to architecture.

**Important Gaps:**
- Version pinning for dependencies (e.g., Node, React, Prisma) is not yet specified in the architecture document—should be addressed during scaffolding.

**Nice-to-Have Gaps:**
- A shared `packages/shared/` for DTOs/types between frontend/backend (not required but helpful).
- A documented step for how to run the dev environment end-to-end (e.g., using docker-compose).

---

### Validation Issues Addressed

No blocking validation issues were found; the architecture is coherent and ready for implementation.

---

### Architecture Completeness Checklist

✅ Requirements Analysis
- [x] Project context analyzed
- [x] Cross-cutting concerns mapped
- [x] Technical constraints identified

✅ Architectural Decisions
- [x] Stack and starter selected
- [x] Data architecture decision made
- [x] Patterns and naming conventions defined

✅ Implementation Patterns
- [x] Conflict points identified
- [x] Consistency rules documented

✅ Project Structure
- [x] Project tree defined
- [x] Component boundaries defined
- [x] Requirements mapped to structure

✅ Validation
- [x] Coherence checked
- [x] Coverage checked
- [x] Readiness assessed

---

### What would you like to do next?

- **[A] Advanced Elicitation** — explore any remaining uncertainties or edge cases
- **[P] Party Mode** — solicit multiple perspectives on the final architecture
- **[C] Continue** — finalize the architecture and complete the workflow

### Step 3: Containerize with Docker Compose

#### Task: Dockerfiles
Create Dockerfiles for frontend and backend with:
- Multi-stage builds
- Non-root user execution
- Health checks (e.g., `HEALTHCHECK` instruction)

#### Task: Docker Compose
Create a `docker-compose.yml` that orchestrates all containers (app, database if needed) with:
- Proper networking
- Volume mounts for persistence (database, logs)
- Environment configuration via `.env` files and compose profiles

#### Task: Health Checks
Implement health check endpoints and ensure containers report health status. Ensure logs are accessible via `docker-compose logs`.

#### Task: Environment Config
Support dev/test environments using environment variables and compose profiles (e.g., `dev`, `test`).

---

## Step 4: Quality Assurance Activities

### QA Task: Test Coverage
Use AI to analyze test coverage and identify gaps. Target **minimum 70% meaningful coverage**.

### QA Task: Performance Testing
Use Chrome DevTools MCP to analyze application performance and document any issues found.

### QA Task: Accessibility Testing
Run accessibility audits using Lighthouse or axe-core (can be automated via Playwright). Ensure **WCAG AA compliance**.

### QA Task: Security Review
Use AI to review code for common security issues (XSS, injection, etc.) and document findings and remediations.
