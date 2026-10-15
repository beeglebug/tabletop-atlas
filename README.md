# Tabletop Atlas

A sourced field guide to tabletop discovery around Telford and Bridgnorth, built with Next.js, React and TypeScript. Search nearby towns, filter known offerings, and open venue profiles from an accessible list or MapLibre map.

[Public demo](https://tabletop.stuartlee.dev) · [Case study](docs/CASE-STUDY.md) · [Key decisions](docs/DECISIONS.md) · [Release checks and evidence](docs/RELEASE.md)

The dataset contains The Board Room, Waterstones Telford and Smyths Toys Telford. It distinguishes local evidence from national catalogues and unknown facts from confirmed absence. Retail pins are approximate centre/postcode locations. First-hand stock observations, licensed photography and broader coverage remain opportunities to improve the guide. Submissions, accounts, events, saved places and persistence are outside v1 scope.

## Development

Use Node 22 (`nvm use`) and npm:

```sh
npm ci
npm run dev             # http://localhost:3000
npm run check           # formatting, ESLint and TypeScript
npm test                # filtering, geography, URL and content checks
npx playwright install chromium
npm run test:e2e        # desktop/mobile Chromium journeys; starts next dev
```

Try `/?q=Telford&tag=board-games&place=waterstones-telford` or `/venues/the-board-room-bridgnorth`. Browser interaction tests use deterministic map styles; live provider checks also require OpenFreeMap connectivity and WebGL. Mobile tests emulate an iPhone viewport in Chromium, not Safari or a physical phone.

## Architecture and content updates

App Router server components read typed records through `src/lib/content.ts`. The home page and known profiles are pre-rendered. Discovery filters the published dataset locally; `q`, optional geographic `near`, repeated `tag` and selected `place` URL parameters survive reload and browser history. Device coordinates stay in the tab. MapLibre and its worker load only on discovery; profiles need no map worker or request-time content fetch. The list remains usable when mapping fails.

OpenNext serves build-time content using a read-only Workers Static Assets cache. No D1, R2 or ISR is configured. A future database could feed these published representations, but publishing/invalidation and moderation workflows are not implemented.

To update venue content:

1. Edit `src/content/venues.ts`, preserving stable IDs and slugs. Changing a slug requires a redirect decision.
2. Record the actual checked/published/observed dates and associate claims with evidence IDs. Unknown is different from confirmed absence. Build dates never refresh evidence. Preserve approximate-location notes.
3. Run checks and verify the production Worker using the commands below. Review profiles and source disclosures.
4. Commit and push to the connected repository. Cloudflare publishes the new edition after a successful build/deploy; a failed build leaves the previous edition live.
5. Complete the [public release checklist](docs/RELEASE.md).

## Cloudflare deployment

Workers Builds uses Node 22 (tested with 22.23.3), project root `/`, build command `npm run build:worker`, and deploy command `npx wrangler deploy`. The Worker name and self-service binding are `tabletop`, matching `wrangler.jsonc`. The public custom domain is `tabletop.stuartlee.dev`; no `basePath` is needed. `NEXT_PUBLIC_SITE_URL` overrides that origin at build time for canonical/share metadata.

```sh
npm run build:worker
npm run preview -- --port 8790
# Once preview reports ready, in another terminal:
SMOKE_BASE_URL=http://127.0.0.1:8790 npm run smoke
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8790 npm run test:e2e -- --workers=2
```

Stop preview before rebuilding, so the runtime cannot mix manifests and assets from different builds. `npm run build` produces only `.next`; deployment requires `.open-next` from the adapter. Do not commit generated output or secrets. For a manual deployment, authenticate with `npx wrangler login`, build, then run `npm run deploy`.

If Turbopack cannot bind its subprocess port in a restricted environment, use the supported Webpack fallback:

```sh
NEXT_PRIVATE_STANDALONE=true npx next build --webpack
npx opennextjs-cloudflare build --skipNextBuild
```

Only skip the adapter’s Next build after producing fresh standalone output. The normal dashboard command remains unchanged. Hosting CPU/free-plan suitability still needs account metrics; cached pages alone do not establish it.

## Place search and attribution

The regional index recognises towns, villages and suburbs within 60 km of Telford. A recognised place returns venues within 25 km, nearest first, with partial-name and spelling suggestions. Ambiguous names require a choice; `near` retains its GeoNames ID and is checked against the query. Unrecognised searches fall back to venue-name/town text. Distances are straight-line estimates; map panning does not change the search. This is not address/postcode or nationwide geocoding.

`src/content/places.json` is a filtered and restructured 3,514-record extract from the [GeoNames GB gazetteer](https://download.geonames.org/export/dump/GB.zip), downloaded 15 October 2026, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). It retains populated-place codes PPL, PPLA, PPLA2, PPLA3, PPLA4 and PPLX within 60 km of (52.67659, -2.44926), with population used to rank equal suggestions. Footer attribution remains visible without the map. Venue facts have separate citations.

To refresh from a downloaded source archive, run `python3 scripts/import-places.py /path/to/GB.zip`, then `npm run format` and the checks. Builds and visitor searches do not fetch GeoNames or send typed searches to a geocoder.
