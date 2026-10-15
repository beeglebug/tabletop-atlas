# Tabletop Atlas

A community field guide to tabletop shops and venues around Telford, Bridgnorth and Shifnal. The milestone 2 discovery journey from [PLAN.md](PLAN.md) is implemented locally: town/venue search, interest filters, optional device location, synchronised map/list selection, shareable URL state and pre-rendered profiles. The dataset contains The Board Room in Bridgnorth plus two explicitly fictional development venues. See [milestone 2 evidence and screenshots](docs/MILESTONE-2.md).

## Local setup

Use Node 22 (`nvm use`, see `.nvmrc`) and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The anchor profile is `/venues/the-board-room-bridgnorth`. Try `/?q=Shifnal&tag=singles-binders&place=demo-field-guide` for a restorable demo search.

```sh
npm run format         # format source and documentation with Prettier
npm run format:check   # check formatting without changing files
npm run check          # Prettier, ESLint and TypeScript
npm test               # filtering, URL, distance and evidence unit tests
npx playwright install chromium
npm run test:e2e       # desktop/mobile browser journeys; starts next dev
npm run build          # Next.js production build
npm run build:worker   # Next.js build + OpenNext adapter
npm run preview        # serve existing adapter build in local Workers runtime
npm run smoke          # in a second terminal; defaults to http://localhost:8787
```

`npm run start` serves the Next.js production build with Node. Workers preview is the deployment compatibility check. Rebuild before previewing changed source.

## Architecture and curated updates

App Router server components read published content through `src/lib/content.ts`. Local fixtures live in `src/content/venues.ts`; content types are in `src/content/types.ts`. The home page and known profile paths are pre-rendered at build time. Discovery receives the published venue dataset and searches/filters it locally. A separate regional place-name index recognises towns and villages such as Ironbridge and finds venues within 25 km, nearest first; partial-name and spelling suggestions help select a place. See [place-search behaviour and data attribution](docs/PLACE-SEARCH.md). `q`, optional geographic `near`, repeated `tag` and `place` URL parameters restore search, filters and selection through reload and browser back/forward. Device coordinates and the temporary mobile List/Map switch stay out of URLs. Distances are straight-line estimates, not travel routes. MapLibre and its hashed worker load through a client-only dynamic component on discovery; direct profiles do not start a map worker. OpenFreeMap attribution is retained, and map errors leave the list available. Unknown profile slugs return 404. No database, account, R2 bucket, runtime content fetch, or map JavaScript is needed for this milestone.

To publish an editorial update:

1. Edit the typed dataset. Preserve stable IDs; treat changing a slug as a future redirect concern.
2. Add published-source or first-hand evidence with its actual dates. Associate each supported claim with evidence IDs. Unknown facts stay unknown; `false` explicitly means confirmed absence. Never use a build date as a confirmation date. Fictional fixtures must retain their demo label.
3. Run checks, build the Worker, preview it, and run the smoke checks. Review rendered content and source disclosures before release.
4. Commit source and `package-lock.json`, push to the connected repository, and allow Cloudflare Workers Builds to build and deploy.
5. Verify public home/profile links, missing-page 404s and assets. Updates appear after a successful deployment; failed builds leave the previous edition live.

A future database would be an authoritative editing store, with accepted changes regenerating public read representations. Submissions, moderation, ISR and cache invalidation are proposed, not implemented.

## Cloudflare dashboard deployment

The milestone 1 foundation was deployed successfully, as confirmed by the project owner on 15 October 2026. The milestone 2 changes have been verified locally in the Workers runtime and still need deployment through the existing pipeline. No deployed CPU or latency measurements are claimed.

In Cloudflare Workers Builds, connect this project's repository and use Node 22 (for example `NODE_VERSION=22.23.3`), build command `npm run build:worker`, deploy command `npx wrangler deploy`, and root directory `/`. npm uses the committed lockfile for installation. The Worker name must match `tabletop` in `wrangler.jsonc`, including the self-service binding. First verify the provided workers.dev address. Later attach the confirmed custom domain through the dashboard once DNS/account access is established; no `basePath` is required.

For a manual deploy after `npx wrangler login`, run `npm run build:worker`, then `npx wrangler deploy`. The existing `npm run deploy` script is also available to deploy a previously built Worker. Do not commit secrets or Wrangler local state.

If deployment reports “Could not find compiled Open Next config”, check the dashboard build command and root directory. `npm run build` runs only Next.js and produces `.next`; Cloudflare needs `npm run build:worker` to produce `.open-next`, including `.build/open-next.config.edge.mjs`. A successful Next.js build alone is insufficient. Keep the build and deploy steps in the same project root. Do not commit `.open-next` to work around the error.

No billable storage resources are configured. Workers Free CPU and bundle limits still require remote validation; pre-rendering alone does not guarantee every request fits the free allowance. See [verification evidence](docs/VERIFICATION.md) and the [decision journal](docs/DECISIONS.md).

## Current boundaries

This is an early edition, with indexing disabled while demo profiles remain. Only one real venue is included; real contrasting retailers, first-hand observations, venue photography and broader content verification remain for milestone 3. The guide distinguishes sourced facts, conflicting evidence and unknown details; it does not infer stock or community confirmations. Community submissions, accounts and persistence remain deferred. Full accessibility audits and deployed performance/cost measurements remain outstanding.

## Test the deployment build

```sh
npm run build:worker
npm run preview -- --port 8790
# In a second terminal:
SMOKE_BASE_URL=http://127.0.0.1:8790 npm run smoke
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8790 npm run test:e2e -- --workers=2
```

Browser tests use deterministic styles for interaction checks, plus separate live OpenFreeMap checks and screenshots. The live checks require provider connectivity and WebGL (headless Chromium uses software rendering). The mobile project emulates an iPhone-sized viewport in Chromium; it is not a physical-device or Safari test.
