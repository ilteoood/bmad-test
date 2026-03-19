import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { InMemoryStore, OfflineSyncQueue, type SyncStatusEvent } from "./queue";

describe("OfflineSyncQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "onLine", { get: () => true, configurable: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("queues creates and retries until successful", async () => {
    const events: SyncStatusEvent[] = [];
    const mockApi = {
      create: vi
        .fn()
        .mockRejectedValueOnce(new Error("network error"))
        .mockImplementation(async (content: string) => ({
          id: "server-1",
          content,
          completed: false,
          deleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
    };

    const store = new InMemoryStore();
    const queue = new OfflineSyncQueue({
      store,
      api: mockApi as any,
      maxRetries: 2,
      maxBackoffMs: 10,
      onStatus: (event) => {
        events.push(event);
      },
    });

    await queue.init();
    await queue.enqueueCreate("temp-1", "offline note");

    // Let the queue run (it schedules a processing tick)
    await vi.runAllTimersAsync();

    // If the first try fails, it will be retried and eventually succeed.
    expect(mockApi.create).toHaveBeenCalledTimes(2);

    // The first status should be pending (queued)
    expect(events[0]).toMatchObject({ tempId: "temp-1", status: "pending" });

    // Final status should be synced with note returned
    expect(events.some((e) => e.status === "synced" && e.note?.id === "server-1")).toBe(true);

    queue.dispose();
  });
});
