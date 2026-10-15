"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getPlaceSuggestions,
  placeLabel,
  type SearchPlace,
} from "@/lib/places";

export function LocationSearch({
  query,
  onSearch,
}: {
  query: string;
  onSearch: (query: string, near?: string) => void;
}) {
  const [draft, setDraft] = useState(query);
  const input = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = showSuggestions ? getPlaceSuggestions(draft) : [];

  function choose(place: SearchPlace) {
    const label = placeLabel(place);

    // Also replace a misspelling when this place is already the current URL.
    if (input.current) input.current.value = label;

    setDraft(label);

    setShowSuggestions(false);

    onSearch(label, place.id);
  }

  return (
    <form
      className="location-search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setShowSuggestions(false);
      }}
      onSubmit={(event) => {
        event.preventDefault();

        setShowSuggestions(false);

        const query = new FormData(event.currentTarget).get("q");

        onSearch(String(query ?? "").trim());
      }}
    >
      <label htmlFor="place-search">Where shall we go?</label>
      <div className="search-row">
        <input
          ref={input}
          id="place-search"
          name="q"
          type="search"
          defaultValue={query}
          onChange={(event) => {
            setDraft(event.target.value);

            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search a town, village or venue"
          maxLength={120}
          autoComplete="off"
        />
        <Button type="submit" className="primary-button">
          Find places <span aria-hidden="true">→</span>
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div
          className="search-suggestions"
          role="group"
          aria-label="Place suggestions"
        >
          <ul>
            {suggestions.map((place) => (
              <li key={place.id}>
                <button type="button" onClick={() => choose(place)}>
                  <span>{place.name}</span>
                  <span>{place.area}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
