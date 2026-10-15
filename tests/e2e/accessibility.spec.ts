import { expect, test } from "@playwright/test";

for (const path of [
  "/",
  "/venues/the-board-room-bridgnorth",
  "/venues/waterstones-telford",
  "/venues/smyths-toys-telford",
]) {
  test(`accessible content and controls: ${path}`, async ({ page }) => {
    await page.route("https://tiles.openfreemap.org/**", (route) =>
      route.abort(),
    );

    await page.goto(path);

    if (path !== "/") await page.locator("#sources > summary").click();

    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });

    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: typeof import("axe-core") }).axe;

      return (
        await axe.run({
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        })
      ).violations;
    });

    expect(violations).toEqual([]);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
