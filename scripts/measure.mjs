import { chromium } from "@playwright/test";

const base = process.env.MEASURE_BASE_URL ?? "http://127.0.0.1:8790";
const browser = await chromium.launch();
const results = [];

try {
  for (const width of [1440, 390]) {
    for (const path of ["/", "/venues/the-board-room-bridgnorth"]) {
      for (let sample = 1; sample <= 3; sample++) {
        const context = await browser.newContext({
          viewport: { width, height: 844 },
        });
        const page = await context.newPage();

        await page.addInitScript(() => {
          window.atlasMetrics = { lcp: null, cls: 0 };

          new PerformanceObserver((list) => {
            window.atlasMetrics.lcp = list.getEntries().at(-1)?.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) window.atlasMetrics.cls += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
        });

        const response = await page.goto(`${base}${path}`);

        await page.waitForTimeout(3000);

        const metrics = await page.evaluate(() => {
          const nav = performance.getEntriesByType("navigation")[0];

          return {
            ttfb: Math.round(nav.responseStart - nav.requestStart),
            fcp: performance.getEntriesByName("first-contentful-paint")[0]
              ?.startTime,
            ...window.atlasMetrics,
          };
        });

        results.push({
          width,
          path,
          sample,
          status: response?.status(),
          cache: response?.headers()["x-opennext-cache"],
          ...metrics,
        });

        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

console.log(
  JSON.stringify(
    {
      base,
      measuredAt: new Date().toISOString(),
      method:
        "Chromium; fresh context per navigation; 3 samples; no network or CPU throttling; 3-second observation. Lab observations, not field Core Web Vitals or Worker CPU measurements.",
      results,
    },
    null,
    2,
  ),
);
