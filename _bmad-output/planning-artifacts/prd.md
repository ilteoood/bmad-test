---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - "/Users/ilteoood/Documents/git/personal/bmad-test/_bmad-output/planning-artifacts/product-brief-bmad-test-2026-03-17.md"
  - "/Users/ilteoood/Documents/git/personal/bmad-test/_bmad-output/brainstorming/brainstorming-session-2026-03-17-212444.md"
workflowType: 'prd'
documentCounts:
  brief: 1
  research: 0
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: web_app
  domain: note_capture
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - bmad-test

**Author:** iLTeoooD
**Date:** 2026-03-17

## Executive Summary

This is a **web-based note capture app** designed to feel as effortless as writing on paper, while ensuring notes are safely stored via a backend API. Users can open the app, type an idea, and trust it is persisted instantly—no friction, no hesitation.

### What Makes This Special

- **Instant capture, no structure required:** Notes are stored the moment they’re entered, without forcing tags, folders, or categories.
- **Trust through persistence:** A backend service ensures every note is saved and retrievable, eliminating the “did I lose it?” anxiety of paper or local-only tools.
- **Minimal UI, maximum speed:** The experience is crafted to be faster than grabbing a notebook—so the tool becomes the default place to capture ideas.

## Project Classification

- **Project Type:** web app (browser front end + backend API)
- **Domain:** note capture / personal productivity
- **Complexity:** medium (requires backend persistence and endpoints)
- **Project Context:** greenfield (new product)

## User Journeys

### 1) Primary User Journey — “Capture a thought before it disappears”

**Persona:** Solo Creator  
**Situation:** Mid-work, an idea hits while switching tasks (e.g., during a meeting or in the middle of code).  
**Goal:** Capture the idea instantly so it doesn’t get lost.

**Journey:**
- **Opening scene:** The Solo Creator is in the flow and suddenly remembers a concept they want to save.
- **Trigger:** They open the app (web page or shortcut).
- **Action:** The app shows an empty input immediately; they type the note in one go.
- **Critical moment:** They hit “Save” and expect the note to be stored instantly.
- **Resolution:** The note appears in the inbox immediately; they close the app and return to work confidently.

**Why it matters:** This journey validates the core value proposition — “feel as fast as paper, but persistently stored.”

---

### 2) Edge Case Journey — “I can’t connect, but I still need to capture it”

**Persona:** Solo Creator  
**Situation:** The user is offline or the backend is temporarily unreachable (network drop, server hiccup).  
**Goal:** Capture the note anyway, without losing it.

**Journey:**
- **Opening scene:** The user tries to capture a thought but the app can’t reach the backend.
- **Trigger:** Save attempt returns an error (network or server).
- **Action:** The app keeps the note in a local “pending” queue and shows a gentle “saved locally / will sync” message.
- **Critical moment:** The app retries in the background when connectivity returns.
- **Resolution:** The note syncs automatically when online again; the user can see the note in the inbox and continue trusting the system.

**Why it matters:** This keeps the tool trustworthy under real-world conditions and supports the “no lost notes” promise.

---

### 3) Edge Case Journey — “I accidentally deleted a note, but I need it back”

**Persona:** Solo Creator  
**Situation:** The user deletes a note by mistake while triaging the inbox.  
**Goal:** Recover the note easily without frustration.

**Journey:**
- **Opening scene:** The user is cleaning their inbox and deletes a note.
- **Trigger:** Immediately realizes the note was still needed.
- **Action:** They open a “Recently deleted” view (or “Undo” button) and restore the note.
- **Critical moment:** The restore action is immediate and reliable.
- **Resolution:** The note returns to the inbox; the user feels safe using the tool knowing mistakes are reversible.

**Why it matters:** Reduces fear of using the system and supports habit formation by making mistakes low-cost.

---

### Journey Requirements Summary

These journeys imply these capabilities:

- **Instant capture UI** (fast launch + focus on input)
- **Reliable backend persistence** (note saved on first attempt)
- **Offline/queued-save support** (local caching + sync)
- **Undo / restore flow** (recover deleted notes easily)
- **Clear success/failure feedback** (user always knows whether note is safe)

## Success Criteria

### User Success

- **Capture trust:** Users feel confident that once they hit “save,” the note is stored and never lost.
- **Speed:** Users can open the app and record a note in **≤ 5 seconds** (faster than grabbing paper).
- **Habit formation:** On days when an idea occurs, users record at least **one note** (the tool becomes the default “brain dump” spot).
- **Friction-free experience:** Users don’t need tags/folders to start; the system feels like a clean inbox.

### Business Success

- **Engagement:** Users interact with the app on **≥ 70% of days in a month** (shows it’s become a go-to capture tool).
- **Retention:** Users continue using the tool for **30+ days** (indicates it replaced paper habits).
- **Reliability perception:** Users feel the app “always works” (measured via qualitative feedback or support volume around missing notes).

### Technical Success

- **Persistence guarantee:** Notes submitted through the API are persisted and retrievable **100% of the time** (no data loss).
- **API responsiveness:** Note creation and retrieval endpoints respond in **< 200ms** under normal load.
- **Availability:** Backend services remain available **≥ 99.9%** (so the app is ready when users need it).
- **Searchability:** Saved notes can be retrieved quickly (e.g., query results return in < 300ms).

### Measurable Outcomes

- **Time-to-capture:** Median time from open → saved note ≤ 5 seconds.
- **Daily usage:** Active user rate ≥ 70% of days/month.
- **Retention:** 30-day retention rate ≥ 50%.
- **Data reliability:** Zero incidents of lost notes in the first 3 months.

## Product Scope

### MVP - Minimum Viable Product

- Web UI + backend API for:
  - Create note
  - List notes (inbox view)
  - Mark note “done” / delete
- Notes persist reliably in backend store
- Fast and minimal UI (focus on capture speed)

### Growth Features (Post-MVP)

- Search/filter inbox
- Tagging/organizing (optional)
- Sync across devices (account + cloud storage)
- Export/import notes
- Quick capture shortcuts (keyboard shortcut, browser extension)

### Vision (Future)

- Intelligent capture: auto-categorize or suggest context
- Cross-device seamless sync + offline-first
- “Inbox zero” workflows (triage/review mode, archive/history)
- Integrations with other tools (calendar, tasks, notes)

## Web App Specific Requirements

### Project-Type Overview

This is a **single-page application (SPA)** delivered via modern browsers, with a backend API that persists notes.

### Technical Architecture Considerations

- **SPA architecture:** A frontend SPA (e.g., React/Vite) that communicates with a backend API.
- **Browser support:** Target latest Chrome only (desktop).
- **No SEO requirements:** The product does not need crawlable public pages.
- **No real-time sync required:** Notes are saved via API and retrieved on demand; no live collaboration or push updates.
- **Basic accessibility:** Provide keyboard navigation and focus management for core interactions (create note, save, navigate inbox).

### Implementation Considerations

- **Routing:** Simple client-side routing or a single route is sufficient.
- **State management:** Lightweight state management focused on note creation and inbox listing.
- **API contract:** Design REST-like endpoints for note CRUD operations.
- **Error handling:** Clear user feedback for save failures (network issues, server errors) and retry capability.
- **Performance:** Optimize for fast initial load and quick note entry (under 2 seconds to first interaction).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem MVP — deliver the smallest version of the product that reliably solves the core problem (capture notes quickly and persistently) so we can learn fast.

**Resource Requirements:** A small cross-functional team (1–2 engineers + 1 designer/PM) to build the core capture flow, backend persistence, and reliable sync behavior.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Capture a thought quickly and save it with one action.
- Recover from transient failures (offline/temporary network issues).
- Undo accidental deletion.

**Must-Have Capabilities:**
- Fast note entry UI (open + type + save in < 5 seconds)
- Backend note persistence API (create/read/update/delete)
- Local caching + retry support for offline/unstable networks
- Simple “inbox” listing of recent notes
- Undo/restore for deleted notes

### Post-MVP Features (Phase 2)

- Search and filtering within the inbox
- Tagging/organizing (optional metadata) for later triage
- Sync across devices (account and cloud storage)
- Export/import notes
- Quick capture shortcuts (keyboard shortcut, browser extension)

### Vision (Expansion) - Phase 3

- Intelligent capture: auto-categorize or suggest context
- “Inbox zero” workflows (triage mode, archive/history)
- Integrations with other tools (calendar, tasks, notes)

### Risk Mitigation Strategy

**Technical Risks:**
- Most challenging: making persistence feel instant while keeping reliability
- Mitigation: build the backend API first, then add local caching/retry layers.

**Market Risks:**
- Biggest risk: users don’t adopt it as their default capture tool.
- Mitigation: validate through quick user tests (time-to-capture, perceived reliability) and iterate.

**Resource Risks:**
- If resources are limited, focus on the core capture+save flow and defer integrations and advanced features.

## Functional Requirements

### Note Capture

- **FR1:** The Solo Creator can open the app and immediately begin typing a note.
- **FR2:** The Solo Creator can save a note with a single action (e.g., pressing “Save” or hitting Enter).
- **FR3:** The Solo Creator can see that a note was saved successfully (confirmation feedback).
- **FR4:** The Solo Creator can edit an existing note after saving it.
- **FR5:** The Solo Creator can delete a note.
- **FR6:** The Solo Creator can restore a recently deleted note (undo/delete recovery).

### Note Storage & Persistence

- **FR7:** The system stores each note persistently via the backend API.
- **FR8:** The system can retrieve a list of saved notes for display in the inbox.
- **FR9:** The system ensures that saved notes are not lost, even if the user closes the browser.
- **FR10:** The system retries saving notes if an initial save fails due to network issues.
- **FR11:** The system syncs locally saved notes with the backend once connectivity is restored.

### Inbox & Note Management

- **FR12:** The Solo Creator can view an “inbox” list of recent notes.
- **FR13:** The Solo Creator can mark a note as “done” (or completed).
- **FR14:** The Solo Creator can quickly scan the inbox and find the most recent notes first.
- **FR15:** The Solo Creator can clear/expunge notes from the inbox (e.g., archive or permanently delete).

### Reliability & Trust

- **FR16:** The system provides clear feedback when a note is pending sync or when a save has failed.
- **FR17:** The system automatically retries note synchronization without user intervention.
- **FR18:** The system indicates when it is offline and that notes are being stored locally until connectivity returns.
- **FR19:** The system preserves note content across page reloads and browser restarts.

### Accessibility & Usability

- **FR20:** The Solo Creator can navigate the core capture workflow using keyboard-only controls.
- **FR21:** The Solo Creator can focus the note input field immediately upon opening the app.
- **FR22:** The Solo Creator can operate core actions (save, delete, undo) without requiring a mouse.

### API / Backend Capabilities

- **FR23:** The backend exposes an endpoint to create a note (POST).
- **FR24:** The backend exposes an endpoint to list notes (GET).
- **FR25:** The backend exposes an endpoint to update a note (PUT/PATCH).
- **FR26:** The backend exposes an endpoint to delete a note (DELETE).
- **FR27:** The backend returns appropriate responses for success and failure, allowing the frontend to act accordingly.

## Non-Functional Requirements

### Performance

- **NFR1:** User-facing actions (open note editor, save note, load inbox) complete within **2 seconds** on a modern desktop machine.
- **NFR2:** Backend API responses for create/read operations complete in **< 200ms** under normal load.

### Reliability

- **NFR3:** Notes must be preserved across page reloads and browser restarts with **0 data loss**.
- **NFR4:** For offline/save-fail scenarios, notes saved locally must automatically sync within **60 seconds** after network restoration.

### Accessibility

- **NFR5:** The core capture workflow must be fully operable via keyboard-only controls.
- **NFR6:** Focus must move logically (input → save → inbox) without requiring a mouse.

## Implementation Components

### Component: Backend

**Implementation Task:** Build the API for CRUD operations on todos. Use AI to generate endpoints, validation, and error handling based on BMAD specs.

**QA Integration:** Write integration tests for each API endpoint as you build them. Use Postman MCP or similar to validate API contracts.

### Component: Frontend

**Implementation Task:** Build the UI for todo management. Use AI to generate components and state management based on BMAD specs.

**QA Integration:** Write component tests as you build. Use Chrome DevTools MCP to debug and inspect during development.

### Component: E2E Tests

**Implementation Task:** Create end-to-end tests covering all user journeys defined in stories.

**QA Integration:** Use Playwright MCP to automate browser interactions. Cover: create todo, complete todo, delete todo, empty state, error handling.

## Infrastructure & Containerization

### Step 3: Containerize with Docker Compose
Use Docker Compose to containerize and orchestrate your application.

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

## Quality Assurance Activities

### QA Task: Test Coverage
Use AI to analyze test coverage and identify gaps. Target **minimum 70% meaningful coverage**.

### QA Task: Performance Testing
Use Chrome DevTools MCP to analyze application performance. Document any issues found.

### QA Task: Accessibility Testing
Run accessibility audits using Lighthouse or axe-core (can be automated via Playwright). Ensure **WCAG AA compliance**.

### QA Task: Security Review
Use AI to review code for common security issues (XSS, injection, etc.). Document findings and remediations.

