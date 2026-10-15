"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { PublishedVenue } from "@/content/types";
import {
  filters,
  getResults,
  productLabels,
  serviceLabels,
  typeLabels,
  venueTags,
  type Coordinates,
  type Filter,
} from "@/lib/discovery";
import {
  getPlaceSuggestions,
  placeLabel,
  resolvePlace,
  SEARCH_RADIUS_KM,
  type SearchPlace,
} from "@/lib/places";
import { LocationSearch } from "./location-search";
import { MapPanel } from "./map-panel";
import { useDiscoveryState } from "./url-state";

export function Discovery({ venues }: { venues: readonly PublishedVenue[] }) {
  const { state, update } = useDiscoveryState();
  const [origin, setOrigin] = useState<Coordinates>();
  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const locationRequest = useRef(0);
  const query = state.query;
  const near = state.near;
  const town = useMemo(() => resolvePlace(query, near), [query, near]);
  const activeFilterKey = state.filters.join(",");
  const activeFilters = useMemo(
    () => filters.filter((tag) => activeFilterKey.split(",").includes(tag)),
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

  function search(query: string, near?: string) {
    locationRequest.current += 1;

    setOrigin(undefined);

    setLocating(false);

    setLocationMessage("");

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
    locationRequest.current += 1;

    setLocating(false);

    setOrigin(undefined);

    setLocationMessage("");

    update({ query: "", filters: [], selected: "" });
  }

  function locate() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location isn’t available in this browser. Search for a town or place instead.",
      );

      return;
    }

    const request = ++locationRequest.current;

    setLocating(true);

    setLocationMessage("Finding your location…");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (request !== locationRequest.current) return;

        update({ ...state, query: "", near: undefined, selected: "" });

        setOrigin({ latitude: coords.latitude, longitude: coords.longitude });

        setLocating(false);

        setLocationMessage(
          "Places sorted by distance. Your location stays in this tab and is not included in shared links.",
        );
      },
      (error) => {
        if (request !== locationRequest.current) return;

        setLocating(false);

        setLocationMessage(
          error.code === 1
            ? "Location access was denied. Search for a town or place instead."
            : "We couldn’t find your location. Search for a town or place, or try again.",
        );
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
    );
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
      <fieldset className="filters">
        <legend>What are you looking for?</legend>
        {filters.map((tag) => (
          <label
            key={tag}
            className={`filter-chip ${state.filters.includes(tag) ? "is-active" : ""}`}
          >
            <input
              type="checkbox"
              checked={state.filters.includes(tag)}
              onChange={() => toggleFilter(tag)}
            />
            {tag in productLabels
              ? productLabels[tag as keyof typeof productLabels]
              : serviceLabels[tag as keyof typeof serviceLabels]}
          </label>
        ))}
        <button className="clear-button" onClick={clear}>
          Clear all
        </button>
      </fieldset>
      <p className="dataset-note">
        <span className="mini-stamp">Early edition</span> One researched venue +
        two fictional demo places. Demo pins are illustrative, not destinations.
      </p>
      <div className="results-bar">
        <h2
          ref={resultsHeading}
          tabIndex={-1}
          id="results-heading"
          aria-live="polite"
        >
          {results.length} {results.length === 1 ? "place" : "places"}
          {town ? (
            <> near {town.name}</>
          ) : state.query ? (
            <> for “{state.query}”</>
          ) : null}
        </h2>
        {town ? (
          <span>Within {SEARCH_RADIUS_KM} km · nearest first</span>
        ) : origin ? (
          <span>Nearest first · straight-line distance</span>
        ) : null}
        <div className="view-switch" aria-label="Results view">
          <button
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button aria-pressed={view === "map"} onClick={() => setView("map")}>
            Map
          </button>
        </div>
      </div>
      {origin &&
        results[0]?.distance !== undefined &&
        results[0].distance > 50 && (
          <p className="notice">
            You’re outside our small patch. These are the nearest places in our
            Telford, Bridgnorth and Shifnal guide.
          </p>
        )}
      <div className="discovery-grid" data-view={view}>
        <section className="results-panel" aria-labelledby="results-heading">
          <ol className="results-list">
            {results.map(({ venue, distance }, index) => (
              <li key={venue.id}>
                <article
                  className={`result-card ${selected === venue.id ? "is-selected" : ""}`}
                >
                  <div className="result-topline">
                    <span className="result-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="eyebrow">
                      {typeLabels[venue.classification]}
                    </p>
                    {venue.contentKind === "demo" && (
                      <span className="demo-label">Fictional demo</span>
                    )}
                  </div>
                  <h3>
                    <Link href={`/venues/${venue.slug}`}>{venue.name}</Link>
                  </h3>
                  <p className="result-town">
                    {venue.town}
                    {distance !== undefined && (
                      <>
                        {" "}
                        · {distance < 1 ? "<1" : Math.round(distance)} km away
                      </>
                    )}
                  </p>
                  <p className="result-summary">{venue.summary}</p>
                  <ul className="tags" aria-label="Known offerings">
                    {venueTags(venue).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="result-actions">
                    <button
                      className="text-link"
                      aria-pressed={selected === venue.id}
                      onClick={() => select(venue.id)}
                    >
                      {selected === venue.id
                        ? "Selected on map"
                        : "Select on map"}
                    </button>
                    <Link className="text-link" href={`/venues/${venue.slug}`}>
                      Read field note →
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          {!results.length && (
            <div className="empty-state">
              <p className="eyebrow">An uncharted corner</p>
              <h3>No places found, yet.</h3>
              <p>
                {town
                  ? `No listed venues match within ${SEARCH_RADIUS_KM} km of ${town.name}. Try fewer filters or another nearby place.`
                  : unmatchedQuery
                    ? `We couldn’t match “${state.query}” to a place or venue in this regional guide. Search covers Telford, Bridgnorth and neighbouring towns and villages.`
                    : "Try fewer filters. Unknown offerings aren’t counted as matches."}
              </p>
              {!town && getPlaceSuggestions(query, 3).length > 0 && (
                <ul className="suggested-places" aria-label="Suggested places">
                  {getPlaceSuggestions(query, 3).map((place) => (
                    <li key={place.id}>
                      <button
                        className="text-link"
                        onClick={() => choose(place)}
                      >
                        Search near {placeLabel(place)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button className="outline-button" onClick={clear}>
                Show all places
              </button>
            </div>
          )}
        </section>
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
              {venue.contentKind === "demo" ? " (fictional demo)" : ""}
            </a>
          </p>
        ))}
      </noscript>
    </section>
  );
}
