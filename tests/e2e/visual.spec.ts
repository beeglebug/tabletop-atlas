import { expect, test } from "@playwright/test";

// Live provider check: complements deterministic journey tests with real tiles.
test("live map and profile visual checkpoints", async ({ page }, testInfo) => {
  await page.goto("/?place=board-room-bridgnorth");

  await expect(
    page.getByRole("heading", { name: "3 places", exact: true }),
  ).toBeVisible();

  if (testInfo.project.name === "mobile") {
    await page.screenshot({
      path: testInfo.outputPath("discovery-list.png"),
      fullPage: true,
      scale: "css",
    });

    await page.getByRole("button", { name: "Map", exact: true }).click();
  }

  await expect(
    page.getByRole("link", { name: "OpenFreeMap", exact: true }),
  ).toBeVisible({ timeout: 20000 });

  await expect(page.getByText("Unfolding the map…")).not.toBeVisible({
    timeout: 20000,
  });

  await expect(
    page.getByRole("heading", { name: "The guide is still open." }),
  ).not.toBeVisible();

  await page.waitForLoadState("networkidle");

  await page.screenshot({
    path: testInfo.outputPath("discovery-map.png"),
    fullPage: true,
    scale: "css",
  });

  await page.goto("/venues/the-board-room-bridgnorth");

  await page.locator("#sources > summary").click();

  await expect(
    page.getByRole("link", { name: "Venue website", exact: true }),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await page.screenshot({
    path: testInfo.outputPath("profile.png"),
    fullPage: true,
    scale: "css",
  });
});
