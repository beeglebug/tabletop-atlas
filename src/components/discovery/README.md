# Reading discovery

Start with `discovery.tsx`. It connects the pieces in three steps:

1. Read state: `useDiscoveryState` supplies the URL's query, filters and selection. `useDeviceLocation` supplies temporary device coordinates. The List/Map view is ordinary local React state.
2. Derive results: resolve the town, filter and sort venues with `getResults`, then check whether the selected venue is still visible. These calculations do not change state.
3. Render: pass values down to the components and event callbacks back up to Discovery.

## Where each responsibility lives

| File                     | Responsibility                                                            |
| ------------------------ | ------------------------------------------------------------------------- |
| `discovery.tsx`          | Page composition, result calculations and search/filter/selection actions |
| `url-state.ts`           | Read and update the URL, including back/forward navigation                |
| `use-device-location.ts` | Request location, show progress/errors and ignore obsolete responses      |
| `location-search.tsx`    | Search input, draft text and place suggestions                            |
| `discovery-filters.tsx`  | Offering checkboxes and Clear all button                                  |
| `results-toolbar.tsx`    | Result count, distance explanation and List/Map buttons                   |
| `discovery-results.tsx`  | Venue cards, empty results and recovery suggestions                       |
| `map-panel.tsx`          | Map loading/failure boundary and selected venue preview                   |
| `venue-map.tsx`          | MapLibre instance, markers and their lifecycle                            |

The new display components receive props rather than owning another copy of search state. They belong to Discovery's client component tree; they do not each need a `"use client"` directive.

## Follow one interaction

Checking **Board games** calls `DiscoveryFilters.onToggle`. Discovery's `toggleFilter` updates the URL through `update`. The URL subscription causes a render, `getResults` calculates the matching venues, and both the list and map receive those results.

Device location is different: coordinates stay in memory. Starting a new search, clearing, or using browser history cancels the previous location request logically. The browser may still deliver its response, but the hook compares request numbers and ignores it. The success callback reads the latest URL state so a delayed response preserves any filters chosen while waiting.

## Why the memoisation exists

Selecting a marker changes the URL but should not rebuild every marker. `activeFilterKey` gives equivalent filter arrays a stable key; the memoised results and `visibleVenues` then keep the same references when only selection changes. MapLibre can update the selected button without replacing it and losing keyboard focus.
