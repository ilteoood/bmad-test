import * as Axe from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportPath = path.resolve(__dirname, "../../../docs/accessibility-report.json");

test("app has no detectable accessibility violations", async ({ page }) => {
  await page.goto("/");

  const AxeBuilder = (Axe.default as any).default;
  const results = await new AxeBuilder({ page }).analyze();

  // Persist a report for later review.
  await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.promises.writeFile(reportPath, JSON.stringify(results, null, 2), "utf-8");

  expect(results.violations).toEqual([]);
});
