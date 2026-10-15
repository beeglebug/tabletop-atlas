# Milestone 2 — first complete discovery journey

15 October 2026. Implemented and verified locally. The project owner confirmed the milestone 1 deployment; this milestone 2 build has not been deployed by the agent.

## Product and architecture

The discovery page searches the names/towns in the published regional dataset. Four AND filters cover singles binders, board games, casual play and game libraries. Only known positive facts match: missing evidence does not become a negative claim. Device location sorts matching results by straight-line distance and handles denial, unsupported browsers and unavailable location. It is temporary tab state, never written to the URL or a server.

The URL stores `q`, repeated `tag` and stable venue ID `place`. Native history updates plus a small external-store subscription handle reload, deep links and back/forward without request-time content reads or a global state library. A custom change event updates our subscription without synthesising browser navigation events. Invalid filter values are ignored; unknown/filtered-out selections do not create misleading previews. The mobile List/Map switch is temporary UI state. Browser back restores the discovery URL after opening a profile.

One filtered result array drives both numbered list results and map pins. Selecting a pin changes the same URL state as selecting a list result; selection updates existing marker buttons so keyboard focus survives. MapLibre loads in a separate client-only component. The v6 worker requires an explicit hashed asset URL under Next/Turbopack. Map initialization, style/network errors, chunk errors and timeouts have a list fallback; the map is never the sole route to essential information. OpenFreeMap supplies the quiet Positron style and visible provider/data attribution. Profiles remain pre-rendered server content, with a small client helper to reveal/focus cited sources in a disclosure.

The map and device coordinates are unrelated: the former uses stored venue coordinates. No external geocoding or browser location request runs automatically. There is no contribution or account workflow.

## Content honesty

The Board Room is the researched anchor. Its [official site](https://theboardroombridgnorth.co.uk/) supports its identity, address and booking link; the linked [LetsBookFor listing](https://letsbookfor.com/venues/the-board-room) supplies venue coordinates in its public structured data and supports the café/play booking details. [Safe Places Shropshire](https://safeplacesshropshire.com/listing/the-boardroom/) provides older supporting context with a stated update date of 1 September 2024. Sources were manually checked on 15 October 2026.

The profile preserves that older evidence date and conflicting hours instead of claiming current opening times. Singles, inventory and specific play offerings without adequate evidence remain unknown. No first-hand visit or contributor count is invented. The two contrasting fixtures are fictional, including their map positions and offerings; they are labelled in discovery, map accessible names/previews and profile content. They must be replaced with real contrasting retailer profiles before v1 completion.

## Verification

Environment: macOS, Node 22.23.3, Next.js 16.3.8, OpenNext Cloudflare 1.20.11, MapLibre GL JS 6.14.0 and Wrangler 4.151.0.

- `npm run check`: Prettier, ESLint and TypeScript pass.
- `npm test`: 4 passing unit tests for canonical URL state, case-insensitive search/AND filters, unknown/false handling, Haversine distances, nearest-first ordering and claim evidence references.
- `npm run build:worker`: Next.js production and OpenNext builds pass. Home and all three profiles are pre-rendered; read-only static asset caching remains configured without R2 or D1.
- `npm run preview -- --port 8790` with `PLAYWRIGHT_BASE_URL=http://127.0.0.1:8790 npm run test:e2e -- --workers=2`: **20 passed**, 12.7 seconds in the recorded run. Desktop is 1440 × 1000; mobile is a Chromium iPhone 13 emulation at 390 × 664 CSS pixels. Includes URL reload/history, deep links, map/list sync, keyboard pin focus, source disclosure/claim links, empty/unknown states, denied/unavailable/unsupported location, nearest ordering, map failure/list recovery, and missing profiles. Direct profile tests verify no map worker starts.
- `SMOKE_BASE_URL=http://127.0.0.1:8790 npm run smoke`: home and three profiles return 200 with server-rendered content/disclosure and working stylesheets; missing profile and unrelated path return useful 404s.
- Real OpenFreeMap styles/tiles render in separate live desktop/mobile checks; attribution is visible. Interaction tests use deterministic styles so provider outages do not masquerade as logic failures. Screenshots from the production Workers preview were visually reviewed for wrapping, selected states, profile/source presentation and layout. Automated overflow checks pass.

These are local development/runtime results, not deployed performance or a comprehensive accessibility audit. Chromium emulation does not establish Safari/physical-device support. No performance score or Free-plan CPU guarantee is inferred. The five previously documented lint dependency advisories remain unchanged. Deployment and milestone 3 must verify real devices/browsers, complete accessibility/performance/cost evidence and replace retail fixtures.

## Review screenshots

Captured from the local production Workers build with live map tiles and provider attribution intact. No venue photography is used until suitable images/rights are available.

[Desktop discovery](screenshots/milestone-2/desktop-discovery.png) · [Desktop profile](screenshots/milestone-2/desktop-profile.png) · [Mobile list](screenshots/milestone-2/mobile-list.png) · [Mobile map](screenshots/milestone-2/mobile-map.png) · [Mobile profile](screenshots/milestone-2/mobile-profile.png)
