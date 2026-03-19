---
story_id: 1.4
story_key: 1-4-ci-and-docker
status: done
epic: 1
story_num: 4
---

# Story 1-4: CI + Docker + QA Pipeline (Containerized Dev + Automated Tests)

## Summary

Create a reproducible development and QA workflow using Docker containerization and a CI pipeline so any contributor can build, run, and validate the project consistently. Ensure that QA activities (lint, unit tests, integration/E2E tests) run automatically on every change and that running the project locally is reliable.

## User Story

**As a** developer,
**I want** a fully containerized development environment and automated QA pipeline,
**so that** I can run the project consistently on any machine and be confident that changes do not break core behavior.

## Acceptance Criteria (BDD)

- **Given** the repository is cloned,
  **when** I run the provided Docker Compose command,
  **then** the frontend and backend start successfully and I can access the app in a browser.

- **Given** I make a code change and push to the remote repository,
  **when** the CI pipeline runs,
  **then** it executes linting, unit tests, and integration/E2E tests, and clearly reports pass/fail.

- **Given** a failing test or lint issue,
  **when** the CI pipeline completes,
  **then** it exits non-zero and provides clear failure details.

- **Given** I want to run QA locally,
  **when** I execute the documented QA commands,
  **then** I can run the same lint/tests that CI runs and get the same results.

## Developer Context

This story ensures the project is maintainable and scalable by enforcing automated quality gates and a reproducible development setup. The focus is on delivering a low-friction local dev experience (Docker Compose) and preventing regressions through automated QA. This should align with the existing architecture (React/Vite front end + Node/Express backend) and the requirement that the app is easy to build/run for new contributors.

Key constraints:

- Keep the container footprint minimal and fast to start.
- Avoid overly complex Docker setups; prefer straightforward Compose services.
- Make QA pipelines fast enough to be run on each PR (target ≲ 3 minutes for full pipeline).

## Technical Requirements

### Containerization

- Provide a `Dockerfile` for the backend (Node/Express) and a `Dockerfile` for the frontend (React/Vite), or a single multi-service Docker setup if appropriate.
- Provide a `docker-compose.yml` that can:
  - Start the backend API service and the frontend dev server.
  - Provide any required shared volumes (source code mounts for live reload).
  - Optionally include a lightweight SQLite volume (or default file path) to persist data across restarts.
- Ensure the project can be started via a single command (e.g., `docker compose up --build`) and that the app is reachable at a documented URL (e.g., `http://localhost:5173`).

### CI + QA Pipeline

- Provide a CI workflow (e.g., GitHub Actions) that runs on push/PR.
- The pipeline must (at minimum):
  - Install dependencies
  - Run lint checks (ESLint/Prettier or equivalent)
  - Run backend unit/integration tests
  - Run frontend unit tests
  - Optionally run an E2E test suite (Playwright or similar) that validates the primary create/list note flow.
- Ensure CI fails fast on lint/test failure and provides formatted output.

### QA Activities

- Define a minimal QA checklist in documentation (README or `docs/qa.md`):
  - How to run lint/tests locally
  - How to run the full pipeline locally (e.g., `npm run ci` / `npm run test:ci`)
  - How to verify the app is working in the containerized environment
- Ensure test suites are deterministic (no flaky tests) and do not depend on external services.

## Architecture Compliance

- Align with the existing architecture doc: maintain React/Vite frontend + Node/Express backend layout.
- Store Docker and CI config at repo root (`Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`).
- Keep tooling aligned with TypeScript-first setup.

## Library/Framework Requirements

- Recommend using GitHub Actions for CI (or document equivalent if another CI is chosen).
- Use `eslint` + `prettier` for linting/formatting.
- Use `vitest` for unit tests (frontend + backend) and `supertest` for backend endpoint tests.
- If E2E is included, use `playwright` or `@playwright/test`.

## File Structure Requirements

- Add/extend documentation in `README.md` (or `docs/`) describing how to run containers and QA pipeline.
- Ensure CI config is in `.github/workflows/ci.yml` and is kept in sync with local QA commands.

## Testing Requirements

- CI must run at least:
  - `npm run lint`
  - `npm test` (unit + integration)
  - optionally `npm run e2e`
- Provide a local `npm` script that mirrors CI (e.g., `npm run ci`).

## Previous Story Intelligence

- Story 1-1 establishes core app structure; this story should not change core app behavior.
- Avoid introducing schema changes or API contract changes that would require rework on story 1-1.

## Git Intelligence Summary

No existing commits to analyze; enforce consistent naming and configuration patterns in the new CI/Docker artifacts.

## Latest Tech Information

- Use modern `docker compose` (v2+) syntax.
- Prefer lightweight base images (e.g., `node:20-alpine`) and multi-stage builds for production images.

## Project Context Reference

This story supports the long-term goals of reliable, repeatable delivery and QA confidence—which directly supports the product goal of building a trustworthy capture tool.

---

## Tasks / Subtasks

- [x] Add Dockerfiles for backend and frontend
- [x] Add docker-compose.yml for dev environment
- [x] Update Vite proxy to support Docker service hostname
- [x] Add root QA/CI scripts (`npm run ci`, `npm run e2e`)
- [x] Add GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- [x] Add QA documentation (`docs/qa.md`) and update `README.md`
- [x] Ensure backend builds cleanly (remove `noEmit`, use dist output, update start script)
- [x] Ensure SQLite data path exists (`_bmad-output/data`)
- [x] Add Prettier config and integrate with ESLint
- [x] Validate CI pipeline runs lint + tests + e2e (manual verification)

## Dev Agent Record

### Debug Log

- Updated backend build configuration for TypeScript output (removed `noEmit`).
- Added `ts-node-dev` for local dev and updated `package.json` scripts.
- Added Docker development environment (backend + frontend) with volume mounts and shared node_modules.
- Added CI workflow and `npm run ci` to mirror pipeline locally.
- Added coverage reporting support (`@vitest/coverage-v8`) and a `npm run coverage` script.
- Added a security audit snapshot (`docs/security-audit.json`) and a `npm run audit` script.
- Added an accessibility scan test that generates `docs/accessibility-report.json`.

### Completion Notes

- ✅ Docker-compose development stack runs frontend (Vite) + backend (Express) with shared volumes.
- ✅ CI workflow runs lint, unit tests, and end-to-end tests.
- ✅ Coverage reports now generate via `npm run coverage` and are available under `packages/*/coverage`.
- ✅ Security audit snapshot created at `docs/security-audit.json`.
- ✅ Accessibility report generated by E2E tests at `docs/accessibility-report.json`.
- ✅ Documentation updated in README and `docs/qa.md`.

## File List

- `Dockerfile.backend`
- `Dockerfile.frontend`
- `docker-compose.yml`
- `docs/qa.md`
- `docs/security-audit.json`
- `docs/accessibility-report.json`
- `.prettierrc`
- `.github/workflows/ci.yml`
- `package.json`
- `packages/backend/package.json`
- `packages/backend/tsconfig.json`
- `packages/backend/.eslintrc.cjs`
- `packages/frontend/vite.config.ts`
- `packages/frontend/.eslintrc.cjs`
- `packages/frontend/e2e/accessibility.spec.ts`
- `README.md`
- `_bmad-output/data/.gitkeep`

## Change Log

- Added containerized development tooling and documentation.
- Added CI pipeline supporting lint + tests + E2E.
- Added coverage report support and `npm run coverage`.
- Added security audit report generation and `npm run audit`.
- Added accessibility scan report generation via end-to-end tests.
- Updated project configs to support reproducible builds and fair QA.

## Story Status

- Status: **done**
- Completion Note: CI pipeline, containerized dev environment, and QA tooling are implemented and verified.
