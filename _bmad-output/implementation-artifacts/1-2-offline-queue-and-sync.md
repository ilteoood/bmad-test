---
story_id: 1.2
story_key: 1-2-offline-queue-and-sync
status: ready-for-dev
epic: 1
story_num: 2
---

# Story 1-2: Offline Queue + Sync (Reliable Capture When Offline)

## Summary
Ensure notes can be captured while offline or during transient network failures by queuing changes locally and synchronizing them automatically when connectivity returns. The app must keep user trust by never losing entered notes and clearly indicating sync state.

## User Story
**As a** solo creator,
**I want** the app to save notes even when I'm offline, and then sync them automatically when I reconnect,
**so that** I never lose the thought and I can trust the app just like paper.

## Acceptance Criteria (BDD)
- **Given** the app is offline or backend is unreachable,
  **when** I create a note,
  **then** it is added to a local queue and the UI shows it as pending sync.

- **Given** there are pending notes in the queue,
  **when** the app detects connectivity is restored,
  **then** it automatically retries sending pending notes to the backend until they succeed.

- **Given** a note has been synced successfully,
  **when** I view the note list,
  **then** the note is shown as saved (not pending) and persists after refresh.

- **Given** a note fails to sync after several retries,
  **when** the user is still offline or backend returns an error,
  **then** the UI shows a clear “sync failed” state with a retry option.

## Developer Context
This story builds on the core note CRUD workflow from Story 1-1. The key goal is **trust**: users must never feel like a note could disappear due to poor connectivity. The architecture uses a React/Vite frontend with a Node/Express backend. The offline queue should be implemented on the client side using a persistent storage mechanism (IndexedDB, localStorage, or similar) so that notes survive page reloads and browser restarts.

### Key constraints
- Must not require changes to the backend API (backend provides standard note CRUD endpoints).
- Must keep the UX minimal: the primary user flow should remain fast, with a lightweight status indicator.
- Must not block the user from continuing to add more notes while sync is pending.

## Technical Requirements
- **Client-side queueing:** Implement an offline queue that stores new notes (and optionally updates/deletes) locally until they are successfully synced.
- **Persistent local storage:** Use IndexedDB (preferred) or localStorage to persist queued actions across reloads.
- **Connectivity detection:** Detect online/offline status (navigator.onLine + `online`/`offline` events) and trigger sync attempts.
- **Retry logic:** Implement exponential backoff retries with a reasonable cap (e.g., max 5 retries or 1 minute interval) and surface errors when sync fails repeatedly.
- **UI state:** For each note, show one of: `synced`, `pending`, `failed` (with a retry action). Prefer a subtle visual indicator (e.g., icon or badge) so UI stays minimal.
- **Sync behavior:** Sync must be associative and idempotent (re-sending a note should not create duplicates). Use backend response (id) for deduplication.

## Architecture Compliance
- Follow the architecture decision doc: frontend is React/Vite, backend is Node/Express with a stable REST contract.
- Keep offline logic encapsulated in a service layer (`services/sync` or similar) and avoid scattering sync logic across UI components.
- Ensure the backend API does not need to change; the queue sync should use the existing `POST /api/notes` and `PATCH /api/notes/:id` endpoints.

## Library/Framework Requirements
- Use a small IndexedDB helper library if needed (e.g., `idb`) to make persistence reliable and simple.
- Keep dependencies minimal; avoid heavy frameworks for offline sync.
- Ensure type safety via TypeScript for the sync queue data structures.

## File Structure Requirements
- Add sync-related code under `packages/frontend/src/services/sync/` (or equivalent) to keep it isolated.
- Add any local storage helpers under `packages/frontend/src/lib/` or `packages/frontend/src/services/`.

## Testing Requirements
- Unit tests for the sync queue logic (queueing, persistence, retry behavior).
- Integration test that simulates offline mode and verifies notes are eventually synced when reconnected.
- Repeatable tests that do not require actual network changes (mock online/offline and API responses).

## Previous Story Intelligence
- This story must integrate cleanly with Story 1-1’s note creation flow. Do not change the API contract or require additional backend endpoints.

## Git Intelligence Summary
No prior git history to analyze; remain consistent with existing naming and project structure.

## Latest Tech Information
IndexedDB is the recommended persistent storage for browsers; avoid localStorage for large/numerous pending notes. Modern browsers support `navigator.onLine` and `online`/`offline` events, but they are not 100% reliable; always treat them as hints.

## Project Context Reference
This is a core trust requirement: capture must work even when connectivity is not guaranteed.

---

## Story Status
- Status: **ready-for-dev**
- Completion Note: Ultimate context engine analysis completed - comprehensive developer guide created.
