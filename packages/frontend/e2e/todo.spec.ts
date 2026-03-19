import { test, expect } from "@playwright/test";

let noteDb: Array<any> = [];
let nextId = 1;

const resetNotes = () => {
  noteDb = [];
  nextId = 1;
};

const jsonHeaders = { "Content-Type": "application/json" };

const setupRouteHandlers = async (page: any) => {
  await page.route("**/api/notes", async (route: any) => {
    const method = route.request().method();

    if (method === "GET") {
      await route.fulfill({ status: 200, headers: jsonHeaders, body: JSON.stringify(noteDb.filter((n) => !n.deleted)) });
      return;
    }

    if (method === "POST") {
      const body = JSON.parse(await route.request().postData() ?? "{}");
      const note = {
        id: `${nextId++}`,
        content: body.content,
        completed: false,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      noteDb.unshift(note);
      await route.fulfill({ status: 201, headers: jsonHeaders, body: JSON.stringify(note) });
      return;
    }

    await route.continue();
  });

  await page.route("**/api/notes/*", async (route: any) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const id = url.pathname.split("/").pop();

    if (method === "PATCH") {
      const body = JSON.parse(await route.request().postData() ?? "{}");
      const note = noteDb.find((n) => n.id === id);
      if (!note) {
        await route.fulfill({ status: 404, body: "Not found" });
        return;
      }
      Object.assign(note, body, { updatedAt: new Date().toISOString() });
      await route.fulfill({ status: 200, headers: jsonHeaders, body: JSON.stringify(note) });
      return;
    }

    if (method === "DELETE") {
      const note = noteDb.find((n) => n.id === id);
      if (note) {
        note.deleted = true;
        note.updatedAt = new Date().toISOString();
      }
      await route.fulfill({ status: 204 });
      return;
    }

    await route.continue();
  });
};

test.beforeEach(async ({ page }) => {
  resetNotes();
  const dbName = `bmad_sync_queue_test_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  await page.addInitScript((dbName) => {
    (window as any).__BMAD_SYNC_OVERRIDES = {
      maxRetries: 1,
      maxBackoffMs: 10,
      dbName,
    };
    Object.defineProperty(navigator, "onLine", { get: () => true });
  }, dbName);

  await page.goto("/");
  await setupRouteHandlers(page);
});

test("empty state shows when no notes exist", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/no notes yet/i)).toBeVisible();
});

test("can create a note and then complete + delete it", async ({ page }) => {
  await page.goto("/");

  const noteText = "E2E test note";
  await page.getByPlaceholder(/type your note here/i).fill(noteText);
  await page.getByRole("button", { name: /save/i }).click();

  const noteItem = page.getByText(noteText).first();
  await expect(noteItem).toBeVisible();

  // Wait for sync to finish (pending indicator removed) before interacting
  await expect(page.getByText(/pending sync/i)).toHaveCount(0);

  const noteRow = noteItem.locator("xpath=ancestor::li");
  const checkbox = noteRow.locator("input[type='checkbox']");

  const [patchResponse] = await Promise.all([
    page.waitForResponse((res) => res.url().includes("/api/notes/") && res.request().method() === "PATCH"),
    checkbox.click(),
  ]);

  expect(patchResponse.ok()).toBeTruthy();

  await expect(noteRow).toHaveClass(/completed/);

  const deleteButton = noteItem.locator("xpath=ancestor::li//button[text() = 'Delete']");
  await deleteButton.click();
  await expect(page.getByText(noteText)).toHaveCount(0);
});

test("shows sync failed state when backend returns error", async ({ page }) => {
  await page.goto("/");

  let postAttempts = 0;
  await page.route("**/api/notes", async (route) => {
    if (route.request().method() === "POST") {
      postAttempts += 1;
      if (postAttempts === 1) {
        await route.fulfill({ status: 500, body: "Internal error" });
        return;
      }
    }
    await route.continue();
  });

  const overrides = await page.evaluate(() => (window as any).__BMAD_SYNC_OVERRIDES);
  expect(overrides?.maxRetries).toBe(1);

  const noteText = "E2E error note";
  await page.getByPlaceholder(/type your note here/i).fill(noteText);
  const [request] = await Promise.all([
    page.waitForRequest((req) => req.url().endsWith("/api/notes") && req.method() === "POST"),
    page.getByRole("button", { name: /save/i }).click(),
  ]);

  await expect(page.getByText(/pending sync/i)).toBeVisible();
  await expect(request).toBeTruthy();

  await page.getByRole("button", { name: /retry/i }).click();
  await expect(page.getByText(noteText).first()).toBeVisible();
});
