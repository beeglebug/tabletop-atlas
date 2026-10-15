# Key decisions

## 15 October 2026 — published content and Cloudflare

Use actual Next.js App Router with OpenNext on Workers. Server components read typed local content through `src/lib/content.ts`; known profiles are pre-rendered and unknown slugs return 404. A read-only Workers Static Assets cache with interception serves the published output without D1 or R2. Content updates require rebuild/deploy. A database-backed editing/publishing pipeline is future work.

Next.js is pinned to 16.3.8 because an earlier latest-version build succeeded but failed actual Worker requests. Changes to framework/adapter versions must pass HTTP tests in workerd, not just a build. The supported local Webpack fallback handles environments where Turbopack cannot bind its subprocess port.

References: [OpenNext setup](https://opennext.js.org/cloudflare/get-started), [SSG cache configuration](https://opennext.js.org/cloudflare/caching).

## 15 October 2026 — evidence and editorial honesty

Stable IDs and URL slugs are separate. Place classification, products and services are independent: retail inventory does not establish play space. Claims distinguish known values, confirmed absence and unknown/conflicting evidence. Checked, published, updated and observed dates have different meanings; cache/build timestamps never refresh them.

The local Waterstones listing supports games browsing. Smyths’ national catalogue does not establish branch stock. Approximate retail coordinates are visibly labelled. There are no invented visitor confirmations or first-hand stock observations. The evidence type can represent a later visitor report without implementing submissions now.

## 15 October 2026 — discovery state and mapping

Search, filters and selection live in the URL; device coordinates and the mobile List/Map switch are temporary. A small History API subscription preserves pre-rendered discovery content without a server search endpoint. Stable filtered results preserve marker DOM nodes and keyboard focus when selection changes. Keep that boundary rather than adding global state machinery.

A separate regional GeoNames index resolves places independently of venue names. This fixes searches such as Ironbridge, which has no venue record but has nearby destinations. The committed extract avoids external geocoding requests; regional coverage and explicit refreshes are the tradeoffs. Source/licence details are in the README.

MapLibre loads on discovery with an explicit bundled worker URL. The accessible results list is complete when the map fails. Source links open the native disclosure and focus the referenced evidence. System fonts avoid external font downloads; restrained cream, green and orange establish the field-guide design.

## 15 October 2026 — keep the implementation proportionate

Removed fictional-demo branches and unused button variants once real content replaced the fixtures. The search input uses the browser’s own value and FormData submission, leaving React to manage suggestions; this avoids resetting rapid keyboard entry. Place names are normalised once, and exact lookups use an index. Keep the small content accessor, URL subscription and map error boundary because they enforce actual publication, history and failure-recovery behaviour.
