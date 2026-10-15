"use client";

import { useMemo, useRef, useState } from "react";
import type { PublishedVenue } from "@/content/types";
import { getResults, type Filter } from "@/lib/discovery";
import {
  getPlaceSuggestions,
  placeLabel,
  resolvePlace,
  type SearchPlace,
} from "@/lib/places";
import { DiscoveryFilters } from "./discovery-filters";
import { DiscoveryResults } from "./discovery-results";
import { ResultsToolbar } from "./results-toolbar";
import { useDeviceLocation } from "./use-device-location";
import { LocationSearch } from "./location-search";
import { MapPanel } from "./map-panel";
import { useDiscoveryState } from "./url-state";

export function Discovery({ venues }: { venues: readonly PublishedVenue[] }) {
  const { state, update } = useDiscoveryState();
  const {
    origin,
    locationMessage,
    locating,
    locate,
    reset: resetLocation,
  } = useDeviceLocation(() => {
    // Read current URL state when the async response arrives, keeping newer filters.
    update((current) => ({
      ...current,
      query: "",
      near: undefined,
      selected: "",
    }));
  });
  const [view, setView] = useState<"list" | "map">("list");
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const query = state.query;
  const near = state.near;
  const town = useMemo(() => resolvePlace(query, near), [query, near]);
  const activeFilterKey = state.filters.join(",");
  // Selection must not recreate map markers and discard keyboard focus.
  const activeFilters = useMemo(
    () => (activeFilterKey ? (activeFilterKey.split(",") as Filter[]) : []),
    [activeFilterKey],
  );
  const results = useMemo(
    () =>
      getResults(
        venues,
        { query, near, filters: activeFilters, selected: "" },
        origin,
      ),
    [venues, query, near, activeFilters, origin],
  );
  const visibleVenues = useMemo(
    () => results.map(({ venue }) => venue),
    [results],
  );
  const unmatchedQuery = Boolean(
    query &&
    !town &&
    !getResults(venues, { query, near, filters: [], selected: "" }).length,
  );
  const selected = visibleVenues.some((venue) => venue.id === state.selected)
    ? state.selected
    : "";
  const suggestions =
    !town && !results.length ? getPlaceSuggestions(query, 3) : [];

  function search(query: string, near?: string) {
    resetLocation();

    update({ ...state, query, near, selected: "" });
  }

  function choose(place: SearchPlace) {
    search(placeLabel(place), place.id);
  }

  function select(id: string) {
    update({ ...state, selected: id });
  }

  function toggleFilter(tag: Filter) {
    update({
      ...state,
      selected: "",
      filters: state.filters.includes(tag)
        ? state.filters.filter((item) => item !== tag)
        : [...state.filters, tag],
    });
  }

  function clear() {
    resetLocation();

    update({ query: "", filters: [], selected: "" });
  }

  function showList() {
    setView("list");

    requestAnimationFrame(() => resultsHeading.current?.focus());
  }

  return (
    <section className="discovery" aria-label="Find tabletop places">
      <div className="search-box">
        <LocationSearch
          key={`${query}:${near ?? ""}`}
          query={query}
          onSearch={search}
        />
        <div className="location-row">
          <button className="text-link" onClick={locate} disabled={locating}>
            ◎ {locating ? "Locating…" : "Use my location"}
          </button>
        </div>
        <p role="status" className="location-status">
          {locationMessage}
        </p>
      </div>
      <DiscoveryFilters
        activeFilters={state.filters}
        onToggle={toggleFilter}
        onClear={clear}
      />
      <p className="dataset-note">
        <span className="mini-stamp">Early edition</span> {venues.length} real
        places, curated from published sources. Offerings marked unknown still
        need checking; retail pins are approximate.
      </p>
      <ResultsToolbar
        headingRef={resultsHeading}
        count={results.length}
        town={town}
        query={query}
        hasLocation={Boolean(origin)}
        view={view}
        onViewChange={setView}
      />
      {origin &&
        results[0]?.distance !== undefined &&
        results[0].distance > 50 && (
          <p className="notice">
            You’re outside our small patch. These are the nearest places in our
            Telford, Bridgnorth and Shifnal guide.
          </p>
        )}
      <div className="discovery-grid" data-view={view}>
        <DiscoveryResults
          results={results}
          selected={selected}
          town={town}
          query={query}
          unmatchedQuery={unmatchedQuery}
          suggestions={suggestions}
          onSelect={select}
          onChoose={choose}
          onClear={clear}
        />
        <MapPanel
          venues={visibleVenues}
          selected={selected}
          onSelect={select}
          onShowList={showList}
          searchCentre={town}
        />
      </div>
      <noscript>
        <p className="notice">
          Search and the map need JavaScript. You can still browse every profile
          below.
        </p>
        {venues.map((venue) => (
          <p key={venue.id}>
            <a href={`/venues/${venue.slug}`}>
              {venue.name} — {venue.town}
            </a>
          </p>
        ))}
      </noscript>
    </section>
  );
}
