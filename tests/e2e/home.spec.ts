import { test, expect } from "@playwright/test";

const HERO_HEADING =
  "Your retro finds, delivered faster than the nostalgia hits.";

// Smoke test to ensure the storefront renders and key CTA is present.
test("home page renders hero content", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/retro/i);
  await expect(
    page.getByRole("heading", { level: 1, name: HERO_HEADING }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /shop the catalog/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /start selling/i }),
  ).toBeVisible();
});
