import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
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
});
