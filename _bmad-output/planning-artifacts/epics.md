# Epics & Stories

This document captures the high-level epics and stories that will be used to guide implementation.

## Epic 1 - Core Note Capture MVP

**Objective:** Deliver the core capture experience that makes the app feel as fast and reliable as writing on paper.

**Business Value:** Enable users to quickly capture ideas with confidence that they will never be lost, laying the foundation for future enhancements (sync, search, organization).

### Stories

#### 1-1-core-note-capture — Project scaffolding + core note CRUD implementation
- **Goal:** Establish the baseline architecture and implement the minimum working end-to-end note capture workflow (frontend + backend + persistence).
- **Acceptance Criteria:**
  - Project repo contains working frontend and backend scaffolding that can be run locally.
  - User can create a note via UI and see it persisted and reloaded on refresh.
  - API has endpoints to create, list, update (complete), and delete notes.
  - Basic tests cover the core note CRUD flow.

#### 1-2-offline-queue-and-sync — Offline capture reliability
- **Goal:** Ensure notes can be created while offline and are synced automatically when connectivity returns.
- **Acceptance Criteria:**
  - Notes created while offline are stored locally and retried automatically.
  - UI clearly indicates when a note is pending sync and when it is successfully synced.
  - Notes are never lost when connection is flaky.

#### 1-3-undo-restore — Safe deletion and recovery
- **Goal:** Provide a reliable undo/restore flow so users can recover accidentally deleted notes.
- **Acceptance Criteria:**
  - Deleting a note moves it to a recoverable state (undo stack or "Recently Deleted" view).
  - User can restore a deleted note within the session.
  - Persisted state reflects restore actions correctly.

#### 1-4-ci-and-docker — QA pipeline + containerization
- **Goal:** Establish a reproducible development environment with containerization and automated QA pipelines so the project can be built, tested, and validated consistently.
- **Acceptance Criteria:**
  - The project can be built and run locally via Docker (`docker compose up` or equivalent).
  - Automated CI pipeline runs lint, unit tests, and integration/E2E tests on each push.
  - QA activities include running tests and producing pass/fail exit codes, with clear reports.
  - Documentation explains how to run the environment locally and in CI.
