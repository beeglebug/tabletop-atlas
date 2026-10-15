import { expect, test } from "@playwright/test";

// Exercise real MapLibre markers without depending on third-party tile availability.
test.beforeEach(async ({ page }) => {
  await page.route("https://tiles.openfreemap.org/**", (route) =>
    route.fulfill({
      json: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#e9ecdf" },
          },
        ],
      },
    }),
  );
});

test("search and filters restore through reload and browser history", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "3 places", exact: true }),
  ).toBeVisible();

  await page.getByRole("searchbox").fill("Shifnal");

  await page.getByRole("button", { name: "Find places" }).click();

  await expect(page).toHaveURL(/q=Shifnal/);

  await page.getByRole("checkbox", { name: "Singles binders" }).check();

  await expect(
    page.getByRole("heading", { name: "1 place near Shifnal" }),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("checkbox", { name: "Singles binders" }),
  ).toBeChecked();

  await expect(page.getByRole("searchbox")).toHaveValue("Shifnal");

  await page.getByRole("button", { name: "Clear all" }).click();

  await expect(
    page.getByRole("heading", { name: "3 places", exact: true }),
  ).toBeVisible();

  await page.goBack();

  await expect(
    page.getByRole("checkbox", { name: "Singles binders" }),
  ).toBeChecked();

  await page.goForward();

  await expect(
    page.getByRole("checkbox", { name: "Singles binders" }),
  ).not.toBeChecked();
});

test("list and map selection synchronise; profile opens with sources", async ({
  page,
}, testInfo) => {
  await page.goto("/?place=board-room-bridgnorth");

  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Map", exact: true }).click();

  await expect(
    page.getByRole("button", { name: "Select The Board Room", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  await page
    .getByRole("button", {
      name: "Select The Sample Table (fictional demo)",
      exact: true,
    })
    .press("Enter");

  await expect(page).toHaveURL(/place=demo-field-guide/);

  await expect(
    page.getByRole("button", {
      name: "Select The Sample Table (fictional demo)",
      exact: true,
    }),
  ).toBeFocused();

  await expect(
    page.getByRole("button", {
      name: "Select The Sample Table (fictional demo)",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");

  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "List", exact: true }).click();

  const card = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "The Sample Table", exact: true }),
  });

  await expect(
    card.getByRole("button", { name: "Selected on map" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page
    .getByRole("heading", { name: "The Board Room", exact: true })
    .getByRole("link")
    .click();

  await expect(
    page.getByRole("heading", { name: "The Board Room", exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText("Individual evidence dates vary.", { exact: false }),
  ).toBeVisible();

  await page
    .getByText("Sources & updates", { exact: false })
    .last()
    .press("Enter");

  await expect(
    page.getByRole("link", { name: "Venue website", exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText("Source last updated on", { exact: false }),
  ).toBeVisible();

  await page.goto("/venues/the-board-room-bridgnorth#source-booking");

  await expect(page.locator("#sources")).toHaveAttribute("open", "");

  await expect(page.locator("#source-booking")).toBeFocused();
});

test("unknown filters, empty results, direct profiles and missing pages recover", async ({
  page,
}) => {
  await page.goto("/?tag=invalid&place=missing");

  await expect(
    page.getByRole("heading", { name: "3 places", exact: true }),
  ).toBeVisible();

  await page.getByRole("searchbox").fill("Uncharted");

  await page.getByRole("button", { name: "Find places" }).click();

  await expect(
    page.getByRole("heading", { name: "No places found, yet." }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Show all places" }).click();

  await expect(
    page.getByRole("heading", { name: "3 places", exact: true }),
  ).toBeVisible();

  await page.goto("/venues/demo-high-street");

  await expect(
    page.getByRole("heading", { name: "High Street Books & Games" }),
  ).toBeVisible();

  await expect(page.getByText("Not available (demo)").first()).toBeVisible();

  const response = await page.goto("/venues/not-a-venue");

  expect(response?.status()).toBe(404);

  await expect(
    page.getByRole("link", { name: "Return to the guide" }),
  ).toBeVisible();
});

test("denied location and unavailable map preserve a complete list", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (
          _success: unknown,
          error: (value: { code: number }) => void,
        ) => error({ code: 1 }),
      },
    });
  });

  await page.route("https://tiles.openfreemap.org/**", (route) =>
    route.abort(),
  );

  await page.goto("/");

  await page.getByRole("button", { name: "Use my location" }).click();

  await expect(
    page.getByText("Location access was denied.", { exact: false }),
  ).toBeVisible();

  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Map", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "The guide is still open." }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Go to results list" }).click();

  await expect(
    page.getByRole("heading", { name: "3 places", exact: true }),
  ).toBeFocused();

  await expect(
    page.getByRole("heading", { name: "The Board Room", exact: true }),
  ).toBeVisible();
});

test("device location sorts locally without exposing coordinates in the URL", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (
          success: (value: {
            coords: { latitude: number; longitude: number };
          }) => void,
        ) => success({ coords: { latitude: 52.678, longitude: -2.445 } }),
      },
    });
  });

  await page.goto("/");

  await page.getByRole("button", { name: "Use my location" }).click();

  await expect(
    page.getByText("Places sorted by distance.", { exact: false }),
  ).toBeVisible();

  await expect(page.locator(".results-list > li").first()).toContainText(
    "High Street Books & Games",
  );

  expect(new URL(page.url()).search).toBe("");
});

test("keyboard search, focus and layout work at the configured viewport", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");

  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();

  await page.getByRole("searchbox").focus();

  await page.keyboard.type("Bridgnorth");

  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", { name: "3 places near Bridgnorth" }),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

for (const scenario of ["unavailable", "unsupported"] as const) {
  test(`location ${scenario} leaves search available`, async ({ page }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "geolocation", {
        value:
          mode === "unsupported"
            ? undefined
            : {
                getCurrentPosition: (
                  _success: unknown,
                  error: (value: { code: number }) => void,
                ) => error({ code: 2 }),
              },
      });
    }, scenario);

    await page.goto("/");

    await page.getByRole("button", { name: "Use my location" }).click();

    await expect(
      page.getByRole("status").filter({
        hasText:
          scenario === "unsupported"
            ? "Location isn’t available"
            : "We couldn’t find your location",
      }),
    ).toBeVisible();

    await page.getByRole("searchbox").fill("Bridgnorth");

    await page.getByRole("button", { name: "Find places" }).click();

    await expect(
      page.getByRole("heading", { name: "3 places near Bridgnorth" }),
    ).toBeVisible();
  });
}

test("a direct profile does not start a map worker", async ({ page }) => {
  const workers: string[] = [];

  page.on("worker", (worker) => workers.push(worker.url()));

  await page.goto("/venues/the-board-room-bridgnorth");

  await expect(
    page.getByRole("link", { name: "Visit venue website" }),
  ).toBeVisible();

  await page.locator("#sources > summary").click();

  await expect(page.locator("#source-booking")).toBeVisible();

  expect(workers).toEqual([]);
});

test("Ironbridge, which has no listed venue, finds nearby places and restores the map centre", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  await page.getByRole("searchbox").fill("Ironbridge");

  await page.getByRole("button", { name: "Find places" }).click();

  await expect(
    page.getByRole("heading", { name: "3 places near Ironbridge" }),
  ).toBeVisible();

  await expect(page.getByText("Within 25 km · nearest first")).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("heading", { name: "3 places near Ironbridge" }),
  ).toBeVisible();

  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Map", exact: true }).click();

  await expect(
    page.getByRole("img", { name: "Search centre: Ironbridge" }),
  ).toBeVisible();

  await expect(page.locator(".map-pin")).toHaveCount(3);

  await page.goBack();

  await expect(
    page.getByRole("heading", { name: "3 places", exact: true }),
  ).toBeVisible();
});

test("partial and misspelled towns offer usable keyboard suggestions", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("searchbox").fill("Broesley");

  const suggestion = page
    .getByRole("group", { name: "Place suggestions" })
    .getByRole("button", { name: "Broseley Shropshire" });

  await expect(suggestion).toBeVisible();

  await suggestion.press("Enter");

  await expect(
    page.getByRole("heading", { name: "3 places near Broseley" }),
  ).toBeVisible();

  await expect(page).toHaveURL(/near=2654539/);

  await page.getByRole("checkbox", { name: "Singles binders" }).check();

  await expect(
    page.getByRole("heading", { name: "1 place near Broseley" }),
  ).toBeVisible();
});

test("known places without nearby venues differ from unrecognised searches", async ({
  page,
}) => {
  await page.goto("/?q=Leominster");

  await expect(
    page.getByText("No listed venues match within 25 km of Leominster.", {
      exact: false,
    }),
  ).toBeVisible();

  await page.getByRole("searchbox").fill("hjk");

  await page.getByRole("button", { name: "Find places" }).click();

  await expect(
    page.getByText("We couldn’t match “hjk” to a place or venue", {
      exact: false,
    }),
  ).toBeVisible();
});
