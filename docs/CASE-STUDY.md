# Tabletop Atlas: finding a useful place to play

I wanted to find shops where I could browse Magic singles while visiting an unfamiliar town. Generic business listings rarely explain the difference between a display cabinet, a binder behind the counter and an ordering terminal. Tabletop Atlas explores a broader version of that problem: finding somewhere to browse, play or meet other tabletop players, with concrete evidence rather than generic ratings.

The first edition focuses on a small part of Shropshire. The Board Room in Bridgnorth demonstrates a play venue; Waterstones and Smyths in Telford contrast general retail with specialist facilities. A national product catalogue does not prove branch stock. Unknown facts remain visible and are excluded from positive filters. Sparse results are a consequence of honest evidence, not a reason to invent availability.

## Product and interaction choices

Search recognises regional towns and villages, including places without a listed venue, then searches within 25 km. This is useful for a visitor staying in Ironbridge rather than requiring them to know a shop name. Filters, search and selection live in shareable URLs; device coordinates stay in the tab. Browser history restores discovery state.

A complete list sits beside the map on desktop. Mobile visitors switch between them. Keyboard users can select real map markers, open profiles and follow claim citations. Denied location and failed map requests lead back to search and results. A warm field-guide design uses serif headings, forest green, cream and restrained orange accents.

## Architecture and publication

Next.js App Router pre-renders the home page and each known profile. A small typed content-access module separates the published dataset from rendering. MapLibre loads only on discovery, with OpenFreeMap attribution retained. Direct profiles do not start a map worker. Local filtering avoids geocoding services and does not require a database read.

The content pipeline is editorial source review → typed claims and evidence → build and browser verification → Cloudflare deployment. OpenNext serves pre-rendered content through a read-only Static Assets cache. Updates require successful rebuild/deploy. This trades immediate publication for simple, inexpensive public reads. A future database and moderation system would produce these published representations; that write/publish pipeline is proposed, not implemented.

## Evidence and limits

See [release verification](RELEASE.md) for reproducible checks and measured results. Tests cover URL restoration, local proximity, positive-only filtering, map/list selection, missing routes, location failures and source navigation. Accessibility checks inspect the home page and all profiles at desktop/mobile widths. They found a missing map landmark role; keyboard testing also exposed an early-input hydration race, both corrected.

The demo establishes the interaction and evidence model, not community adoption or comprehensive regional coverage. No invented confirmations, user research outcomes or business impact are claimed. Branch stock, first-hand visits, licensed photography, physical-device testing and deployed Worker CPU validation remain explicit limitations. Community submissions, accounts and live stock are future work.

## Selected screens

[Desktop discovery](screenshots/desktop-discovery.png) · [Mobile results](screenshots/mobile-results.png) · [Mobile profile](screenshots/mobile-profile.png)
