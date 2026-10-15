import Link from "next/link";
import { getResults, typeLabels, venueTags } from "@/lib/discovery";
import { placeLabel, SEARCH_RADIUS_KM, type SearchPlace } from "@/lib/places";

/** Displays results and recovery actions; search state belongs to Discovery. */
export function DiscoveryResults({
  results,
  selected,
  town,
  query,
  unmatchedQuery,
  suggestions,
  onSelect,
  onChoose,
  onClear,
}: {
  results: ReturnType<typeof getResults>;
  selected: string;
  town?: SearchPlace;
  query: string;
  unmatchedQuery: boolean;
  suggestions: SearchPlace[];
  onSelect: (id: string) => void;
  onChoose: (place: SearchPlace) => void;
  onClear: () => void;
}) {
  return (
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
                <p className="eyebrow">{typeLabels[venue.classification]}</p>
              </div>
              <h3>
                <Link href={`/venues/${venue.slug}`}>{venue.name}</Link>
              </h3>
              <p className="result-town">
                {venue.town}
                {distance !== undefined && (
                  <> · {distance < 1 ? "<1" : Math.round(distance)} km away</>
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
                  onClick={() => onSelect(venue.id)}
                >
                  {selected === venue.id ? "Selected on map" : "Select on map"}
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
                ? `We couldn’t match “${query}” to a place or venue in this regional guide. Search covers Telford, Bridgnorth and neighbouring towns and villages.`
                : "Try fewer filters. Unknown offerings aren’t counted as matches."}
          </p>
          {suggestions.length > 0 && (
            <ul className="suggested-places" aria-label="Suggested places">
              {suggestions.map((place) => (
                <li key={place.id}>
                  <button className="text-link" onClick={() => onChoose(place)}>
                    Search near {placeLabel(place)}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button className="outline-button" onClick={onClear}>
            Show all places
          </button>
        </div>
      )}
    </section>
  );
}
