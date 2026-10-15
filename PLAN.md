# Tabletop Atlas — project handoff

Updated: 14 October 2026

## Purpose

A portfolio side project aimed at demonstrating senior frontend engineering skills. The user wants Next.js experience because it appears in many target job postings. The project should have a convincing product experience, thoughtful architecture, accessibility, and performance rather than a large feature checklist.

## Product concept

A community field guide to tabletop shops and venues, helping someone visiting an unfamiliar town—or planning a visit—find somewhere to nerd out.

The original personal problem: it is hard to discover shops with browseable Magic: The Gathering singles binders through Google Maps. The concept broadened to general tabletop discovery because that has wider appeal, while retaining useful enthusiast-level details.

This is a field guide with personality and useful local knowledge, rather than simply a map of businesses. Community contributions are the realistic long-term source of that knowledge.

Repo/project name: `tabletop-atlas`. This need not be the final public brand.

## Useful information about places

- Browse and buy: singles binders, bulk boxes, singles cabinets, sealed products, second-hand board games, RPG books, miniatures, paints.
- Stay and play: board game libraries, casual card games, wargaming tables, bookable spaces.
- Join something: drafts, Commander, RPG one-shots, beginner sessions, painting nights.
- Visiting details: opening hours, photos, accessibility, booking requirements, and whether newcomers can drop in alone.
- Community tips, source attribution, and when details were last confirmed.

Distinguish different ways of buying singles: a few display-case cards, browseable binders, and ordering from a terminal are materially different experiences.

Example useful tip: “Three binders of singles behind the counter—just ask.” Prefer concrete observations over generic star ratings.

## Confirmed v1 demo journey

1. Search for a town/place in the curated area, or optionally use device location.
2. Show matching shops and venues on a map with pins, alongside an accessible results list.
3. Open a pin or list result to view a detailed shop/venue profile.
4. Show tags describing the products and services offered, supported by concrete venue details and information freshness.

Handle denied/unavailable device location with a usable search fallback. Use stored venue coordinates for map placement and proximity calculations. For the initial regional scope, search curated towns and venues locally; arbitrary-address search and external geocoding are deferred.

Shareable URL state remains in scope. Interest/tag filtering can support this journey, but the exact initial filters remain to be chosen. Events, saving places, and working community submissions are outside v1 scope.

## Demo scope

Data acquisition is explicitly out of scope for the demo. Hand-curated or clearly labelled sample data is acceptable.

V1 covers the user’s surrounding area: Telford, Bridgnorth, Shifnal, and nearby places. Start with roughly six varied venues across this area, adjusting the count to the real local offering. Use hand-curated data with sources and confirmation dates; data acquisition automation remains out of scope.

Suggested initial scope:

- Discovery page with synchronised list/map and filters.
- Detailed venue page.
- Shareable URL state.
- Hint at future community contributions with clearly labelled coming-later messaging. V1 displays hand-curated data only; no submission form, persistence, moderation, or accounts are required.
- Good mobile behaviour, loading/empty/error states, and keyboard accessibility.

Accounts, reviews, owner dashboards, national coverage, live stock feeds, and automated data collection have not been requested. Avoid making them prerequisites.

## Initial venue targets and classification

The user has selected The Board Room in Bridgnorth as the anchor venue: they play there every Friday and can supply first-hand observations. The name/address and specific facilities should be confirmed during curation rather than inferred from this selection.

Include a couple of contrasting general retailers, such as local Waterstones or Smyths Toys branches, to demonstrate the difference between a dedicated tabletop venue and a general shop that also sells products such as Magic boosters. Exact branches and their product availability remain to be confirmed; these are targets, not verified listings.

- Model venue type separately from product/service tags: dedicated tabletop shop/venue versus general retailer with a tabletop offering. Allow the classification to expand for clubs and other venue types if real data requires it.
- Model shopping and playing as separate capabilities. Selling Magic boosters does not imply singles, organised events, play space, or a tabletop community.
- Show the distinction clearly in map/list previews and profiles, using plain labels such as “Tabletop venue” and “General retailer”. Specific labels should reflect the evidence for each place.
- Support separate product and service facts with provenance and unknown/not-checked states. Do not turn missing evidence into a claim that a service is unavailable.
- Start the first complete vertical slice with the anchor venue and contrasting retail profiles before expanding regional coverage. Do not invent local branches or inventory to meet a target count.

## V1 freshness and community signals

Even though submissions are deferred, venue profiles should communicate freshness and suggest the future community model.

- Display “Last checked on [date]” for curated venue information, with source/provenance details where useful. Distinguish checking a venue’s published information from visiting it in person.
- Support detail-level confirmation dates when individual claims have different evidence, especially enthusiast details such as browseable singles binders.
- “Confirmed by 3 guides” is an intended community signal, but display a contributor count only when backed by distinct real people confirming the relevant information. Do not infer multiple confirmations from multiple websites or invent activity for real venues. If illustrative counts are used in sample fixtures, explicitly label that content as demo data.
- For an initially single-curator dataset, use honest wording such as “Checked by the editor” or “1 guide”, as appropriate to the evidence.
- Freshness badges and small stamp-like treatments can provide the journal character while communicating useful information. Avoid making a whole venue appear verified when only particular details were checked.
- No functioning submission, confirmation, account, or moderation flow is required for v1; any future-contribution affordance must clearly indicate that it is coming later.

## Information sources and citations

The user wants an inspectable citations/source-history system that distinguishes published information from first-hand visitor contributions.

- Provide a “Sources & updates” disclosure on venue profiles, with source links associated with the facts they support where practical.
- For externally published information, store a source URL, publisher/title, date checked, and publication/update date if known. Describe manual curation accurately; use “scraped” only if automated collection actually occurred. Automated acquisition remains out of scope for v1.
- For future visitor contributions, record submission date, subsequent edit dates, and the date of the visit/observation if supplied. Clearly distinguish a first-hand report from a contributor quoting another source. Expose only appropriate public contributor identity, not private account details.
- V1 implements the source disclosure for hand-curated data. The data model can accommodate visitor reports later, without requiring submission or edit workflows now.
- Dates describe specific actions: published, checked, visited, submitted, and edited are different. Editing a report must not automatically refresh the observation/confirmation date.
- Prefer claim-level provenance for changeable or important details such as opening hours, booking requirements, accessibility, or singles-binder availability. A compact venue-level source list can group citations by the details they support.
- Keep conflicting or outdated evidence visible with clear wording where relevant; a citation indicates provenance, not automatic proof that a claim is currently correct. Missing sources and unknown dates should remain explicit rather than being invented.

Suggested interaction: a compact freshness/source summary near practical details opens an accessible disclosure or panel listing supported facts, linked sources, and relevant dates. Exact presentation remains a design choice.

## Confirmed visual direction

A modern field guide with a restrained tabletop-journal influence. The user prefers warmth and character over an overly crisp or clinical appearance.

- Warm off-white/cream backgrounds, dark forest-green text, and burnt-orange accents for selected pins and primary actions.
- Characterful serif headings paired with a clear sans-serif for controls, tags, and practical details.
- Real venue photography and concrete local observations supply most of the personality.
- Occasional stamp-like badges, subtly irregular outlines, and light print-inspired details add a collected/journal feel. Keep these accents sparse and intentional; avoid heavy texture, fantasy parchment, or decorative game-shaped controls.
- Product/service tags remain plain, readable, and easy to scan. Reserve more expressive stamps for editorial highlights or factual status where supported by the data; do not imply verification or endorsement without evidence.
- Keep map styling quiet so venue pins stand out. Maintain clear focus states, sufficient contrast, and generous touch targets regardless of decorative treatment.

Suggested layout, still to validate during design: results beside a generous map on desktop; a List/Map switch and compact pin previews on mobile.

## Technology direction

User preference: Next.js, deployment through Cloudflare dashboard. No code has been implemented or dependencies installed.

Proposed stack:

- Next.js App Router and TypeScript.
- Tailwind CSS with shadcn/ui using Base UI primitives.
- MapLibre GL JS with OpenFreeMap tiles; local search of curated towns/venues, with no external geocoding provider for v1.
- Cloudflare Workers for application/backend execution.
- Typed local data behind a small data-access module for v1, suitable for pre-rendering. Defer Cloudflare D1 until persistence is needed; D1 remains the likely future relational store.
- Cloudflare R2 only when uploaded photos are needed; static demo photos can ship with the app initially.
- Playwright for important end-to-end journeys, with focused unit tests for nontrivial filtering/date logic.

Earlier Postgres suggestion was revised to D1 given Cloudflare preference and demo scale. With submissions deferred, a database is no longer a v1 requirement. If D1 is introduced later, Drizzle is the recommended ORM candidate. Keep data access behind a small module.

### Architecture to explore

- Render/pre-render town guides and place content on the server, with metadata and share previews.
- Client components for map, filters, geolocation, and selected place interactions.
- Put shareable search state in the URL; keep temporary UI state local. No global state library required initially.
- When contributions are implemented in a later version, validate them on the server.
- Make the list a complete accessible discovery experience.
- Avoid loading map JavaScript on pages that do not need it.
- Verify browser back/forward, deep links, and map/list selection synchronisation.

### Confirmed architecture principle: cached public reads

The user wants this principle considered from the outset and included in the portfolio architecture discussion: published discovery content is served from pre-rendered or cached representations, rather than requiring a live database read on every public request.

- V1 uses curated local data as the source of truth and generates public content from it at build/deploy time.
- A future database would become the authoritative content store, while public venue profiles and discovery datasets remain cached/materialised read representations.
- Future submissions and edits are persisted separately; accepted/published changes trigger invalidation or regeneration of affected venue pages and discovery data. An unpublished submission must not alter public cached content.
- Public search, tags, map pins, and proximity calculations should operate on the published regional dataset where practical. Larger-scale search can later use a separately cached query/read service without abandoning this principle.
- Define content access behind a small module, stable venue identifiers, and explicit published-content types. Keep evidence dates separate from cache-generation timestamps.
- Exact cache mechanisms, regeneration timing, and invalidation APIs remain to be validated against the chosen Next.js/OpenNext/Cloudflare deployment. Account for potentially stale content and failed refreshes; do not promise instantaneous publication.
- This principle concerns public content delivery. Future authenticated editing/moderation and write operations can access the database directly. A cache regeneration may also read the authoritative store.

Portfolio explanation: separate content management from content delivery because venue information changes infrequently relative to reads. Discuss fast public pages, reduced database/runtime work, and the tradeoff of bounded staleness plus invalidation complexity. Clearly distinguish the implemented v1 build-time pipeline from the proposed future database-backed publishing pipeline.

### Deployment ownership and hostname

The project will have its own GitHub repository and an independent Cloudflare deployment configured through the dashboard. Host it on a portfolio subdomain, provisionally `tabletop.stuartlee.dev`; the portfolio itself remains independently deployed.

Use Cloudflare Workers Builds connected to the project repository for build/deploy automation, with the Next.js/OpenNext build configuration validated in milestone 1. Attach the chosen hostname as the Worker’s Custom Domain. This requires an active Cloudflare DNS zone for `stuartlee.dev` in the appropriate account; confirm existing DNS/account setup before configuring it. A subdomain does not require Next.js `basePath` configuration.

The hostname is provisional until confirmed. Deploy first to the provided workers.dev address if custom-domain access is not yet available, then attach the subdomain and verify HTTPS, deep links, canonical URLs, and share metadata. No repository creation, DNS changes, or deployment has been performed during planning.

### Cloudflare deployment consideration

At research time, Cloudflare documented OpenNext for running actual Next.js on Workers, while recommending vinext for new projects. Because learning and demonstrating Next.js is an explicit goal, the suggested direction was actual Next.js with OpenNext. This is a recommendation, not a final user-approved implementation choice.

Deploy a representative pre-rendered page early and verify current adapter/runtime support before building the whole app. Defer the D1-backed form spike until persisted contributions enter scope.

References:

- https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/
- https://developers.cloudflare.com/d1/
- https://developers.cloudflare.com/r2/

## Cost preference and constraints

The user asked whether it can run free. Aim for a £0 portfolio demo, but do not promise that all Next.js workloads fit Workers Free.

Free allowances checked on 14 October 2026:

- Workers: 100,000 requests/day and 10 ms CPU time per invocation.
- D1: 5 GB total storage, 5 million rows read/day, 100,000 rows written/day.
- R2 Standard: 10 GB-month storage, 1 million Class A operations/month, 10 million Class B operations/month.

Workers CPU allowance is a potential constraint for Next.js server rendering even with low traffic. Prefer pre-rendering suitable content and test representative runtime paths early.

R2 requires activating a billing subscription and can charge above included usage; omit initially if unnecessary. Map tiles/geocoding are separate services and must be chosen with their own terms and costs in mind. Domain costs are separate.

Recheck current pricing before implementation:

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/r2/pricing/

## Portfolio evidence to build toward

- A distinctive, coherent mobile and desktop experience.
- Clear reasoning about server/client boundaries and URL state.
- Accessible filters, venue details, forms, and keyboard navigation.
- Useful handling of denied geolocation, unavailable maps, no matches, and failed submissions.
- Measured performance and an explanation of improvements.
- Meaningful tests of shared search restoration and filtering; add contribution validation/persistence tests when that functionality enters scope.
- A short case study explaining the personal problem, product choices, tradeoffs, and evidence.

## Adopted technology choices and portfolio rationale

The user has delegated tooling choices, prioritising portfolio marketability. Adopt the following for v1:

- UI: Tailwind CSS with shadcn/ui using Base UI primitives. Use accessible behaviours as a foundation and create a distinctive field-guide visual design rather than adopting a generic dashboard layout.
- Maps: MapLibre GL JS with OpenFreeMap tiles. Preserve required attribution and make discovery usable if the map fails. OpenFreeMap’s public service is free without API keys but has no SLA.
- Location search: filter the curated towns and venues locally, with coordinates stored in the dataset. No external geocoder is needed for the initial regional scope. Optional browser geolocation can use those coordinates.
- Data: typed local TypeScript data behind a small read module for v1. Add D1 and potentially Drizzle when persistent writes or richer data management justify them.

References checked on 14 October 2026:

- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default
- https://openfreemap.org/
- https://openfreemap.org/quick_start/
- https://orm.drizzle.team/docs/sqlite/connect-cloudflare-d1

Next.js App Router, React, and TypeScript are the central portfolio technologies, matching the user’s stated job-search goal. Tailwind and shadcn/ui support delivery of a polished interface. MapLibre demonstrates interactive mapping. The strongest evidence should be the implementation: clear server/client boundaries, accessible navigation, URL state, responsive behaviour, performance, and meaningful tests. A database or ORM is not required merely to expand the stack list.

## Record reasoning and evidence during implementation

Keep a lightweight project journal as work proceeds, rather than reconstructing the case study at the end. Record meaningful decisions and results, not every implementation step.

For each significant product, design, or architecture decision, capture:

- The problem or constraint and the options considered.
- The chosen approach, why it fits, and the tradeoff accepted.
- Evidence: relevant sources, screenshots, test results, user feedback, or performance measurements.
- What is implemented versus proposed, remaining uncertainty, and any reason to revisit the decision.

Prioritise evidence for the cached-publication architecture, Next.js server/client boundaries, URL state, map/list behaviour, provenance and unknown states, visual direction, accessibility, and Cloudflare feasibility. Record performance measurements with the page, environment, and method so comparisons are meaningful. Save useful before/after screenshots and measurements when making improvements.

Keep this proportionate: brief dated entries in a repository document, with focused architecture records only for substantial decisions. Use this material to write the final portfolio case study, accurately distinguishing shipped behaviour from future plans.

## Definition of finished — v1

V1 is complete when the following are demonstrated on the deployed application:

### Content and product scope

- The Board Room in Bridgnorth and at least two contrasting local retail locations have complete, useful profiles. Exact branches, names, coordinates, and offerings are verified during curation; expand beyond this initial slice only if it improves the regional experience.
- Place type and product/service tags clearly distinguish dedicated tabletop venues from general retailers. Shopping and playing are separate capabilities.
- Profiles show practical venue details, relevant enthusiast observations, and freshness information. Unknown/not-checked facts are distinguishable from confirmed absence.
- “Sources & updates” exposes supporting links and relevant dates; first-hand observations are distinguished from published sources. All public confirmation counts and verification claims have evidence.
- Community contributions are clearly presented as coming later; no working submission, account, moderation, events, or saved-place flow is required.

### Discovery journey

- A visitor can search the curated towns/venues or use device location to discover relevant places.
- Map pins and accessible list results represent the same filtered dataset, with consistent selection and clear links to detailed profiles.
- Chosen product/service filters work, can be cleared, and communicate the result count and empty state.
- Shared URLs restore the intended search/filter state. Deep links and browser back/forward work without confusing map/list state.
- Device-location denial, unavailable location, no matches, unavailable maps, and invalid/missing venue URLs have useful recovery paths. Discovery remains usable through the list when the map cannot load.

### Design and accessibility

- The confirmed field-guide design, including restrained stamp/badge details, is coherent across discovery and profile pages.
- The complete journey works on mobile and desktop without obstructed controls or accidental horizontal overflow.
- Search, filters, result selection, source disclosures, and profile navigation are usable with a keyboard, with visible focus, appropriate labels, sufficient contrast, and sensible focus management. Essential venue information does not require operating the map.

### Architecture and verification

- Actual Next.js is deployed successfully on Cloudflare through a validated adapter/runtime path. Public content uses build-time or cached published representations; v1 does not require live database reads.
- A documented curation → build/deploy → published-content workflow demonstrates how updates reach visitors. Future database publishing/invalidation is clearly described as a proposed extension.
- Venue content and metadata are rendered/pre-rendered appropriately; map JavaScript is loaded only where needed. Sources and observation dates remain independent of build/cache timestamps.
- Focused automated checks cover the primary discovery/profile journey, URL restoration, and nontrivial filtering or proximity logic where present. Complete manual mobile, keyboard, and failure-state checks; resolve material failures.
- Measure representative deployed-page performance and accessibility, record the method/results, and address material issues. Validate hosting costs/limits against representative usage and document any unresolved constraint; do not claim a guaranteed free tier without evidence.

### Portfolio handoff

- The README explains the problem, setup, content-update workflow, deployed demo, key architecture choices, and known limitations.
- A concise case study uses the decision journal and real evidence to explain the product choices, tradeoffs, accessibility, performance, and results.
- Remaining enhancements are explicitly deferred rather than blocking completion or appearing as broken features.

## Development milestones and gates

The plan is sufficiently defined to begin a v1 build when requested. Remaining routine design and implementation choices can be resolved during development and recorded in the decision journal; another planning round is not a prerequisite. These gates define evidence needed to progress, not mandatory user-approval pauses. Continue authorised work independently unless a material unanswered question or access requirement blocks it.

### Milestone 1 — foundation and deployment feasibility

Establish Next.js App Router, TypeScript, Tailwind/shadcn, the content-access boundary, and a representative pre-rendered route. Validate the actual Next.js/OpenNext/Cloudflare path early, before extensive feature work. Start the decision journal.

Exit criteria:

- The application runs locally and a production build succeeds.
- A representative deployment demonstrates that the adapter/runtime supports the intended public-content architecture, with initial cost/runtime constraints recorded.
- Curated content types support stable IDs, venue classification, products/services, unknown states, coordinates, and source/observation dates.
- The workflow for changing curated data and publishing it is documented.

Deployment may require user account access or a dashboard step. If unavailable, complete local build and adapter checks, record that remote feasibility remains unverified, and continue independent UI/content work. Do not mark the deployment gate passed or defer all compatibility testing until the end. Escalate any discovered architectural incompatibility before building extensively on it.

### Milestone 2 — first complete discovery journey

Build the agreed visual direction and the search/device-location → synchronised map/list → detailed profile journey, anchored on The Board Room in Bridgnorth. Include the source disclosure and freshness presentation, plus enough clearly identified development fixtures to exercise filtering and contrasting venue types.

Exit criteria:

- The journey works end to end on desktop and mobile, including direct profile links and shareable/restorable search state.
- Map/list selection and keyboard navigation work; device-location denial and map failure have usable fallbacks.
- One rich profile demonstrates place classification, product/service tags, unknown states, citations, and relevant dates.
- Capture screenshots, initial verification results, and significant design/architecture reasoning for the portfolio record.

This is the first useful visual review checkpoint. Incorporate user feedback when available without requiring approval for every routine implementation choice. Publicly supported facts can be researched during development; first-hand details from the user remain unknown until supplied. Clearly labelled fixtures may support local development, but must not be presented as verified facts about real venues.

### Milestone 3 — complete and verify v1

Replace development fixtures with verified curated content for the anchor venue and at least two contrasting real local retailers. Finish the selected filters, source histories, responsive polish, recovery states, and focused automated/manual checks. Verify the representative deployed experience and prepare the README and case study.

Exit criteria:

- Every required item in the definition of finished is satisfied with recorded evidence.
- Real venue data is sourced appropriately; unsupported first-hand claims and invented community activity are absent.
- Material accessibility, functional, deployment, and performance issues are resolved; remaining limitations are explicit.
- The deployed demo, update workflow, decision record, and portfolio explanation are ready to share.

Missing account access or essential venue verification should be reported as a specific remaining blocker, with all unaffected work completed. A locally complete build can be delivered for review, but v1 is not declared fully finished until the deployed-app and content requirements are met. Deferred features remain deferred unless the user changes scope.

## Open decisions / suggested next steps

1. Curate The Board Room in Bridgnorth and confirm contrasting local Waterstones/Smyths Toys branches and their offerings, then expand across the surrounding area.
2. Develop the confirmed modern-field-guide direction with restrained journal-style stamps/badges into a concrete design; public branding remains open.
3. Choose the initial product/service tag taxonomy and useful filters.
4. Validate actual Next.js/OpenNext deployment on Cloudflare, targeting free limits.
5. Design the confirmed search/device-location → map/results → tagged venue-profile journey, including location permission and empty/error states.
6. Build discovery and venue detail as the first complete vertical slice, with shareable URL state and focused verification.

Confirmed scope: regional coverage; search or device location; map pins and accessible results leading to detailed, tagged venue profiles; hand-curated, read-only data; community submissions hinted at for later. Tooling choices above are adopted under the user’s delegated judgment. Actual Next.js/OpenNext deployment remains subject to an early feasibility check. No implementation has been requested yet.

## Implementation status — 15 October 2026

Milestone 1 local foundation is implemented: Next.js App Router/TypeScript, Tailwind and a shadcn Base UI button foundation, typed published-content access, fictional pre-rendered example profile, source disclosure, build/deploy scripts and documentation. Production and adapter builds, lint/type checks, local Workers HTTP smoke checks and upload dry run pass. The read-only Workers Static Assets cache supports build-time publication without R2.

**Milestone 1 remote deployment gate is not passed:** Cloudflare is unauthenticated and no GitHub repository connection is configured. Remote runtime/CPU/free-tier eligibility remains unverified. See `README.md`, `docs/DECISIONS.md` and `docs/VERIFICATION.md` for reproducible commands, compatibility findings and remaining constraints. Milestone 2 discovery features have not been started.
