# Release checks and evidence

## Current status

The v1 feature implementation is local. The public hostname is [tabletop.stuartlee.dev](https://tabletop.stuartlee.dev); publication of this working tree and final release checks are still required. The README owns setup, architecture, content updates and deployment commands; this file owns verification and remaining release work.

## Verification

Use Node 22 and the lockfile. Before publication:

- Run `npm run check`, `npm test`, and the production adapter build.
- Start a fresh Worker preview, wait for its ready signal, then run `npm run smoke` and `npm run test:e2e` against `PLAYWRIGHT_BASE_URL`.
- Review desktop/mobile screenshots and keyboard interaction, source disclosures, URL/history restoration, empty results, missing routes, denied location and unavailable maps.

Browser checks cover desktop and mobile Chromium, axe WCAG A/AA scans of discovery/all profiles, real map markers and a separate live-provider check. They do not establish full accessibility conformance, Safari behaviour or physical-device coverage.

Latest local verification (15 October 2026): formatting/lint/types, nine unit tests, six Worker HTTP smoke paths and all 46 desktop/mobile browser cases pass, including eight axe scans. Next.js standalone and OpenNext adapter builds pass using the documented Webpack fallback. The case-study screenshots show this reviewed local build. Public deployment checks remain outstanding.

## Public performance baseline — 15 October 2026

Run `MEASURE_BASE_URL=https://tabletop.stuartlee.dev node scripts/measure.mjs`. The script uses three fresh Chromium contexts per route at 1440×844 and 390×844, no CPU/network throttling, and a three-second observation window. [Raw baseline](performance-baseline.json) describes the earlier public edition, not this local release. All 12 navigations returned 200 with `x-opennext-cache: HIT`.

| Viewport | Page           | Median TTFB | Median FCP/LCP | Observed CLS |
| -------- | -------------- | ----------- | -------------- | ------------ |
| 1440 px  | Discovery      | 268 ms      | 544 ms         | 0            |
| 1440 px  | Anchor profile | 240 ms      | 348 ms         | 0            |
| 390 px   | Discovery      | 65 ms       | 472 ms         | 0            |
| 390 px   | Anchor profile | 75 ms       | 216 ms         | 0            |

These are small lab samples, not field Core Web Vitals, INP, a simulated mobile connection or Cloudflare CPU accounting. Re-run after publication and investigate material regressions.

## Remaining release work

- Publish the working tree through the existing Cloudflare pipeline.
- Verify home, all three direct profiles, shared searches, HTTPS, metadata, static assets and missing-route 404s publicly.
- Repeat browser/accessibility/performance checks against that release.
- Check Cloudflare account plan, CPU/error metrics and representative cached/404 requests before claiming free-plan suitability.
- Complete hands-on mobile/keyboard checks; physical iOS/Safari and assistive-technology coverage remain unverified.

Editorial limitations: branch stock and enthusiast details remain unknown where unsourced; retail pins identify approximate centre/postcode locations. No first-hand reports, community activity or licensed venue photography are claimed.

The online dependency audit on 15 October 2026 reports five high findings in the lint-tool chain (`eslint-config-next` → Next ESLint plugin → fast-glob → micromatch → braces). These are not venue-request dependencies; npm’s suggested remediation downgrades the Next.js lint package to v14, so it has not been applied. Recheck when compatible patched tooling is available. The existing `@node-minify/core` glob override addresses an earlier adapter-tool advisory chain.
