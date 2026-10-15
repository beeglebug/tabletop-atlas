import type { Ref } from "react";
import { SEARCH_RADIUS_KM, type SearchPlace } from "@/lib/places";

export function ResultsToolbar({
  headingRef,
  count,
  town,
  query,
  hasLocation,
  view,
  onViewChange,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  count: number;
  town?: SearchPlace;
  query: string;
  hasLocation: boolean;
  view: "list" | "map";
  onViewChange: (view: "list" | "map") => void;
}) {
  return (
    <div className="results-bar">
      <h2
        ref={headingRef}
        tabIndex={-1}
        id="results-heading"
        aria-live="polite"
      >
        {count} {count === 1 ? "place" : "places"}
        {town ? <> near {town.name}</> : query ? <> for “{query}”</> : null}
      </h2>
      {town ? (
        <span>Within {SEARCH_RADIUS_KM} km · nearest first</span>
      ) : hasLocation ? (
        <span>Nearest first · straight-line distance</span>
      ) : null}
      <div className="view-switch" role="group" aria-label="Results view">
        <button
          aria-pressed={view === "list"}
          onClick={() => onViewChange("list")}
        >
          List
        </button>
        <button
          aria-pressed={view === "map"}
          onClick={() => onViewChange("map")}
        >
          Map
        </button>
      </div>
    </div>
  );
}
