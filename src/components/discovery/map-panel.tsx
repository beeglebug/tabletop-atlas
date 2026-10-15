"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useCallback, useState } from "react";
import Link from "next/link";
import type { PublishedVenue } from "@/content/types";
import type { SearchPlace } from "@/lib/places";
import { typeLabels } from "@/lib/discovery";

const VenueMap = dynamic(() => import("./venue-map"), {
  ssr: false,
  loading: () => (
    <p className="map-loading" role="status">
      Unfolding the map…
    </p>
  ),
});

class MapBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function MapPanel({
  venues,
  selected,
  onSelect,
  onShowList,
  searchCentre,
}: {
  venues: readonly PublishedVenue[];
  selected: string;
  onSelect: (id: string) => void;
  onShowList: () => void;
  searchCentre?: SearchPlace;
}) {
  const [failed, setFailed] = useState(false);
  const unavailable = useCallback(() => setFailed(true), []);
  const venue = venues.find((item) => item.id === selected);
  const fallback = (
    <div className="map-fallback" role="status">
      <span className="eyebrow">The map is unavailable</span>
      <h3>The guide is still open.</h3>
      <p>
        All matching places and profile links are in the list. Check your
        connection or reload to try the map again.
      </p>
      <button className="outline-button" onClick={onShowList}>
        Go to results list
      </button>
    </div>
  );

  return (
    <section className="map-panel" aria-label="Map and selected place">
      <div className="map-frame">
        <MapBoundary fallback={fallback}>
          {failed ? (
            fallback
          ) : (
            <VenueMap
              venues={venues}
              selected={selected}
              onSelect={onSelect}
              onUnavailable={unavailable}
              searchCentre={searchCentre}
            />
          )}
        </MapBoundary>
      </div>
      {venue && (
        <div className="pin-preview" aria-live="polite">
          <p className="eyebrow">
            {typeLabels[venue.classification]}
            {venue.contentKind === "demo" && " · Fictional demo"}
          </p>
          <h3>{venue.name}</h3>
          <p>{venue.town}</p>
          <Link className="text-link" href={`/venues/${venue.slug}`}>
            Open full profile →
          </Link>
        </div>
      )}
    </section>
  );
}
