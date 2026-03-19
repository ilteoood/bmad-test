import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

// Simple smoke test that renders the app and ensures core UI elements exist.
describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock fetch so the component can render without hitting a real backend
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ));
  });

  it("renders and displays input", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your note here/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });
  });

  it("queues note and retries on failure until sync succeeds", async () => {
    const createdNote = {
      id: "server-1",
      content: "offline note",
      completed: false,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let callCount = 0;
    vi.stubGlobal("fetch", vi.fn((input, init) => {
      callCount += 1;
      if (callCount === 1) {
        // initial list
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }

      if (init?.method === "POST") {
        if (callCount === 2) {
          return Promise.reject(new Error("network error"));
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve(createdNote) });
      }

      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your note here/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/type your note here/i), { target: { value: "offline note" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/pending sync/i)).toBeInTheDocument();
    });

    // Wait for retry logic to process (backoff is short in test mode)
    await new Promise((resolve) => setTimeout(resolve, 100));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/notes", expect.any(Object));
      expect(callCount).toBeGreaterThanOrEqual(2);
    });
  });

  it("shows an undo toast after delete and restores the note when undo is clicked", async () => {
    const note = {
      id: "note-1",
      content: "Test note",
      completed: false,
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.stubGlobal("fetch", vi.fn((input, init) => {
      if (typeof input === "string" && input === "/api/notes" && !init) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([note]) });
      }

      if (typeof input === "string" && input.startsWith("/api/notes/") && init?.method === "DELETE") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }

      if (typeof input === "string" && input.startsWith("/api/notes/") && init?.method === "PATCH") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ...note, deleted: false }) });
      }

      return Promise.reject(new Error(`Unexpected fetch call: ${input}`));
    }));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(note.content)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText(/note deleted/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /undo/i }));

    await waitFor(() => {
      expect(screen.getByText(note.content)).toBeInTheDocument();
    });
  });
});
