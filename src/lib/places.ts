import regionalPlaces from "@/content/places.json";

export const SEARCH_RADIUS_KM = 25;

export type SearchPlace = (typeof regionalPlaces)[number];

export function normalizeSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-GB")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function placeLabel(place: SearchPlace) {
  return `${place.name}, ${place.area}`;
}

// Normalize the published index once, rather than for every keystroke/render.
const indexedPlaces = regionalPlaces.map((place) => ({
  place,
  name: normalizeSearch(place.name),
}));
const placesByName = new Map<string, SearchPlace[]>();

for (const { place, name } of indexedPlaces) {
  for (const key of new Set([name, normalizeSearch(placeLabel(place))])) {
    const matches = placesByName.get(key) ?? [];

    matches.push(place);

    placesByName.set(key, matches);
  }
}

export function resolvePlace(query: string, id?: string) {
  const normalized = normalizeSearch(query);

  if (!normalized) return undefined;

  const matches = placesByName.get(normalized) ?? [];

  // Never silently choose between different places with the same name.
  return id
    ? matches.find((place) => place.id === id)
    : matches.length === 1
      ? matches[0]
      : undefined;
}

/** Optimal-string-alignment distance also handles adjacent transpositions. */
function spellingDistance(a: string, b: string) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  );

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
    }
  }

  return rows[a.length][b.length];
}

export function getPlaceSuggestions(query: string, limit = 6) {
  const normalized = normalizeSearch(query);

  if (normalized.length < 2) return [];

  return indexedPlaces
    .map(({ place, name }) => {
      let score =
        name === normalized
          ? 0
          : name.startsWith(normalized)
            ? 1
            : name.includes(normalized)
              ? 2
              : Infinity;

      if (
        !Number.isFinite(score) &&
        normalized.length >= 4 &&
        Math.abs(name.length - normalized.length) <= 2
      ) {
        const distance = spellingDistance(name, normalized);

        if (distance <= (normalized.length >= 6 ? 2 : 1)) score = 3 + distance;
      }

      return { place, score };
    })
    .filter(({ score }) => Number.isFinite(score))
    .sort(
      (a, b) =>
        a.score - b.score ||
        b.place.population - a.place.population ||
        a.place.name.localeCompare(b.place.name),
    )
    .slice(0, limit)
    .map(({ place }) => place);
}
