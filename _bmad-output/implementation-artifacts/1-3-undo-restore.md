---
story_id: 1.3
story_key: 1-3-undo-restore
status: ready-for-dev
epic: 1
story_num: 3
---

# Story 1-3: Undo / Restore (Safe Deletion Recovery)

## Summary
Add an undo/restore capability so users can recover notes deleted accidentally. The workflow should be immediate and low-friction (e.g., "Undo" toast or a small recovery view) and should ensure that deleted notes can be restored reliably.

## User Story
**As a** solo creator,
**I want** to quickly recover a note I deleted by mistake,
**so that** I can trust the app and not worry about losing ideas.

## Acceptance Criteria (BDD)
- **Given** I delete a note,
  **when** I take no further action,
  **then** the note is removed from the primary list but can be restored via an undo option for a short period.

- **Given** I choose to undo immediately after deleting,
  **when** I click Undo,
  **then** the note is restored to the active list and persisted as not deleted.

- **Given** I want to restore a deleted note later,
  **when** I open a “Recently Deleted” or “Trash” view,
  **then** I can see deleted notes and restore them.

- **Given** I permanently delete a note from the “Recently Deleted” view,
  **when** I confirm the delete,
  **then** the note is removed permanently and the backend reflects the deletion.

## Developer Context
Deleting notes is a common action, and mistakes are expected. Without an undo/restore UX, users may lose trust. This story should build on the backend CRUD APIs for deletion, but must add a lightweight recovery mechanism that can be used immediately after delete and also later from a recovery view.

### Key constraints
- Keep UI minimal; do not overcomplicate the core capture workflow.
- Ensure backend semantics remain consistent: deleted notes should be removable via existing API endpoints.
- Avoid requiring large schema changes; this can be modeled through a soft-delete flag in the frontend and/or backend depending on tradeoffs.

## Technical Requirements
- **Undo action:** On delete, show a temporary “Undo” action (e.g., toast/snackbar) that reverts the deletion.
- **Soft-delete option:** Option 1 (recommended): implement a soft-delete flag (e.g., `deletedAt` timestamp or `isDeleted`) in the backend so notes can be recovered. Option 2: Keep a local cache of recent deletes and re-post to restore (less robust).
- **Recently Deleted view:** Provide a simple UI view where users can see deleted notes and restore or permanently delete them.
- **API updates:** If using soft-delete, add support for listing deleted notes (e.g., query `?trashed=true` or separate endpoint). If not, implement restoration by re-creating the note using the backend API.
- **Persistence:** Restored notes should behave like regular notes and persist across reloads.

## Architecture Compliance
- Keep changes compatible with the existing note model and REST API style.
- If the backend schema changes (e.g., adding `deleted_at`), ensure migrations are included and data integrity is maintained.

## Library/Framework Requirements
- Use a UI component approach consistent with the rest of the frontend (e.g., a shared `Toast` or `Snackbar` component for undo actions).
- If using soft-delete in the backend, update the Prisma schema and regenerate client.

## File Structure Requirements
- UI components for undo/restore should live under `packages/frontend/src/components/` (e.g., `UndoSnackbar.tsx`, `TrashView.tsx`).
- Backend schema changes (if any) should be under `packages/backend/src/db/` and migrations managed via Prisma.

## Testing Requirements
- Unit tests for the undo flow and recovery view logic.
- Integration test covering delete → undo → list to ensure note reappears and persists.
- If backend changes are made, include migration tests (e.g., ensure deleted notes aren’t returned by default list endpoint).

## Previous Story Intelligence
- Should build on Story 1-1 note CRUD behavior and Story 1-2 sync behavior without introducing conflicting state models.

## Git Intelligence Summary
No prior git history; establish consistent naming and file organization.

## Latest Tech Information
Soft-delete patterns are common (e.g., `deletedAt` fields) and align with Prisma best practices. Ensure UI indicates delete state clearly without confusing the core inbox view.

## Project Context Reference
This story supports the trust goal: users should feel safe deleting notes because recovery is available.

---

## Story Status
- Status: **ready-for-dev**
- Completion Note: Ultimate context engine analysis completed - comprehensive developer guide created.
