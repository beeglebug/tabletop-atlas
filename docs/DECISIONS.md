# Implementation journal

## 15 October 2026 — milestone 1 foundation

**Decision:** use actual Next.js App Router with OpenNext for Workers, rather than a framework substitute or static export. Server components read typed local data through `src/lib/content.ts`; `generateStaticParams` pre-renders the example profile, and unknown slugs return 404. No database or request-time content fetch is required. Updating data requires a new build and deployment. ISR and database publishing remain proposed future work.

**Content:** stable IDs are distinct from URL slugs. Venue classification, products and services are separate. A boolean false means confirmed absence; missing knowledge has an explicit unknown state. Claims reference evidence IDs and separate confirmation dates. Published sources distinguish checked/published/updated dates; visitor reports distinguish observed/submitted/edited dates. Build timestamps never refresh evidence. The sole fixture is a clearly fictional venue, including illustrative coordinates, with no invented citations or confirmation dates. Real venue curation is deferred to milestones 2–3.

**UI:** warm cream, forest green, restrained orange and system Georgia/sans fonts establish a small field-guide shell. System fonts avoid external font fetches during builds. Native source disclosure provides keyboard behaviour without client JavaScript. Base UI/shadcn provides the interactive component foundation; maps and discovery interactions are deferred to milestone 2.

**Deployment approach:** no R2, D1, image service, or incremental-cache resource is provisioned. Validate build-time content in the adapter and local workerd runtime before remote deployment. Local success alone does not establish Cloudflare account eligibility, remote latency, or Workers Free CPU compliance.

References consulted: [OpenNext setup](https://opennext.js.org/cloudflare/get-started), [supported Next.js versions](https://opennext.js.org/cloudflare), [shadcn Next.js setup](https://ui.shadcn.com/docs/installation/next), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

**Compatibility evidence:** the first latest-version build succeeded but failed real Worker requests. Next.js is now pinned to 16.3.8, and the documented read-only Workers Static Assets incremental cache with interception serves pre-rendered profiles. No R2 is needed. The local HTTP checks now pass; remote validation is explicitly pending account access. See [verification](VERIFICATION.md) for versions, failure details, bundle measurements, audit limitations and the deployment checklist. Revisit version pins only alongside Worker HTTP tests.

## 15 October 2026 — milestone 2 discovery and evidence

**Decision:** keep the full regional published dataset in the discovery client and retain server pre-rendering for profiles. Search/filter/selection live in the URL; location and mobile view do not. This gives shareable results and browser history without query-time server reads. A small URL subscription is sufficient at this scale. Selected marker DOM nodes survive selection updates to retain keyboard focus.

**Evidence and tradeoffs:** the anchor profile now uses public sources; unknown inventory stays unknown, and conflicting opening times remain unresolved. Two explicitly fictional contrasting venues exercise the journey without inventing claims for real retailers. MapLibre v6 needed a Next-compatible explicit worker URL; a live tile check caught what deterministic logic tests alone could miss. The list recovers when the map cannot load. The source disclosure opens and focuses the specific citation when a fact link is followed.

**Implemented versus pending:** all 20 desktop/mobile browser tests pass in the local production Workers preview; four unit tests and six HTTP smoke paths also pass. Real tiles and screenshots were reviewed. The owner confirmed milestone 1 was deployed; milestone 2 deployment, real retailer curation and full deployed performance/accessibility work remain pending. [Milestone 2 evidence](MILESTONE-2.md) contains reproduction commands, sources, screenshots and limitations. Next dev generated `AGENTS.md`/`CLAUDE.md`; its bundled routing/lazy-loading guidance was read during verification.

## 15 October 2026 — geographic search independent of venue text

**Problem:** Ironbridge appeared in map labels but a search returned no venues because only venue-name/town substrings were checked. A venue list is not a place-name index.

**Decision:** add a build-time regional GeoNames subset and resolve towns/villages independently. Town searches return nearby venue coordinates within 25 km, ordered by distance, and include the search centre in the map. Partial/spelling suggestions and disambiguation retain local URL restoration. Exact name text search is preserved for venues. A known place with no results is distinguished from an unknown query.

**Tradeoff:** this keeps the existing local published-read architecture and avoids external query requests, geocoder credentials and provider availability on the search path. Coverage is regional and the index must be refreshed explicitly; no arbitrary-address or nationwide search is implied. Attribution and a reproducible extraction script accompany the data. [Place-search behaviour and provenance](PLACE-SEARCH.md) documents the boundaries.
