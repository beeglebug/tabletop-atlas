import type { Product, PublishedVenue, Service } from "@/content/types";
import { normalizeSearch, resolvePlace, SEARCH_RADIUS_KM } from "@/lib/places";

export const productLabels: Record<Product, string> = {
  "sealed-cards": "Sealed cards",
  "singles-binders": "Singles binders",
  "singles-cabinet": "Singles cabinet",
  "singles-terminal": "Singles terminal",
  "board-games": "Board games",
  "rpg-books": "RPG books",
  miniatures: "Miniatures",
  paints: "Paints",
};

export const serviceLabels: Record<Service, string> = {
  "casual-play": "Casual play",
  "organised-play": "Organised play",
  "board-game-library": "Game library",
  "bookable-tables": "Bookable tables",
  "step-free-access": "Step-free access",
};

export const typeLabels = {
  "tabletop-venue": "Tabletop venue",
  "general-retailer": "General retailer",
  club: "Club",
};

export const filters = [
  "singles-binders",
  "board-games",
  "casual-play",
  "board-game-library",
] as const;

export type Filter = (typeof filters)[number];

export type Coordinates = { latitude: number; longitude: number };

export type DiscoveryState = {
  query: string;
  filters: Filter[];
  selected: string;
  near?: string;
};

export function parseDiscoveryState(search: string): DiscoveryState {
  const params = new URLSearchParams(search);

  return {
    query: (params.get("q") ?? "").slice(0, 120),
    filters: filters.filter((filter) => params.getAll("tag").includes(filter)),
    selected: params.get("place") ?? "",
    near: params.get("near") ?? undefined,
  };
}

export function discoveryUrl(state: DiscoveryState) {
  const params = new URLSearchParams();

  if (state.query.trim()) params.set("q", state.query.trim());

  filters
    .filter((filter) => state.filters.includes(filter))
    .forEach((filter) => params.append("tag", filter));

  if (state.near && resolvePlace(state.query, state.near))
    params.set("near", state.near);

  if (state.selected) params.set("place", state.selected);

  return params.size ? `/?${params}` : "/";
}

export function distanceKm(a: Coordinates, b: Coordinates) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitude = radians(b.latitude - a.latitude);
  const longitude = radians(b.longitude - a.longitude);
  const arc =
    Math.sin(latitude / 2) ** 2 +
    Math.cos(radians(a.latitude)) *
      Math.cos(radians(b.latitude)) *
      Math.sin(longitude / 2) ** 2;

  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, arc)));
}

export function getResults(
  venues: readonly PublishedVenue[],
  state: DiscoveryState,
  origin?: Coordinates,
) {
  const query = normalizeSearch(state.query);
  const town = resolvePlace(state.query, state.near);
  const reference = origin ?? town;
  const matches = venues.filter(
    (venue) =>
      (town ||
        normalizeSearch(`${venue.name} ${venue.town}`).includes(query)) &&
      state.filters.every((tag) => {
        const fact =
          tag in venue.products
            ? venue.products[tag as Product]
            : venue.services[tag as Service];

        return fact.status === "known" && fact.value;
      }),
  );

  return matches
    .map((venue) => ({
      venue,
      distance:
        reference && venue.coordinates.status === "known"
          ? distanceKm(reference, venue.coordinates.value)
          : undefined,
    }))
    .filter(
      ({ distance }) =>
        !town || (distance !== undefined && distance <= SEARCH_RADIUS_KM),
    )
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
}

export function venueTags(venue: PublishedVenue) {
  return [
    ...Object.entries(venue.products)
      .filter(([, fact]) => fact.status === "known" && fact.value)
      .map(([key]) => productLabels[key as Product]),
    ...Object.entries(venue.services)
      .filter(([, fact]) => fact.status === "known" && fact.value)
      .map(([key]) => serviceLabels[key as Service]),
  ];
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
