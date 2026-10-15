import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getPlaceSuggestions,
  placeLabel,
  resolvePlace,
  SEARCH_RADIUS_KM,
} from "../../src/lib/places";
import { venues } from "../../src/content/venues";
import {
  discoveryUrl,
  distanceKm,
  getResults,
  parseDiscoveryState,
} from "../../src/lib/discovery";

test("URL state is canonical, deduplicated and ignores unknown filters", () => {
  const state = parseDiscoveryState(
    "?q=%20Bridgnorth%20&tag=casual-play&tag=bad&tag=casual-play&place=board-room-bridgnorth",
  );

  assert.deepEqual(state.filters, ["casual-play"]);

  assert.equal(
    discoveryUrl(state),
    "/?q=Bridgnorth&tag=casual-play&place=board-room-bridgnorth",
  );

  assert.equal(parseDiscoveryState(`?q=${"x".repeat(300)}`).query.length, 120);
});

test("filters require every known positive claim; unknown and false do not match", () => {
  const state = {
    query: "",
    filters: ["board-games"] as const,
    selected: "",
  };

  assert.deepEqual(
    getResults(venues, { ...state, filters: [...state.filters] }).map(
      ({ venue }) => venue.id,
    ),
    ["waterstones-telford"],
  );

  assert.equal(
    getResults(venues, {
      query: "BRIDGNORTH",
      filters: ["singles-binders"],
      selected: "",
    }).filter(({ venue }) => venue.id === "board-room-bridgnorth").length,
    0,
  );

  assert.equal(
    getResults(venues, { query: " bridgnorth ", filters: [], selected: "" })[0]
      .venue.id,
    "board-room-bridgnorth",
  );
});

test("proximity uses stored coordinates, handles zero distance and orders nearest first", () => {
  assert.equal(
    distanceKm(
      { latitude: 52, longitude: -2 },
      { latitude: 52, longitude: -2 },
    ),
    0,
  );

  assert.ok(
    Math.abs(
      distanceKm({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 0 }) -
        111.195,
    ) < 0.01,
  );

  const result = getResults(
    venues,
    { query: "", filters: [], selected: "" },
    { latitude: 52.6766164, longitude: -2.4467826 },
  );

  assert.equal(result[0].venue.id, "waterstones-telford");

  assert.equal(result[0].distance, 0);

  assert.equal(result[2].venue.id, "board-room-bridgnorth");
});

test("published claims reference existing evidence and identities stay unique", () => {
  for (const venue of venues) {
    assert.equal(venues.filter((item) => item.id === venue.id).length, 1);

    for (const fact of [
      venue.address,
      venue.coordinates,
      ...Object.values(venue.products),
      ...Object.values(venue.services),
      ...Object.values(venue.practical),
    ]) {
      for (const id of fact.evidenceIds)
        assert.ok(venue.evidence.some((source) => source.id === id));

      if (fact.status === "known") assert.ok(fact.evidenceIds.length > 0);
    }
  }
});

test("Ironbridge finds nearby places in distance order without a venue-town text match", () => {
  const results = getResults(venues, {
    query: "Ironbridge",
    filters: [],
    selected: "",
  });

  assert.equal(results.length, 3);

  assert.ok(
    results.every(
      ({ distance }) => distance !== undefined && distance <= SEARCH_RADIUS_KM,
    ),
  );

  assert.ok(
    results.every(
      (result, index) =>
        index === 0 || result.distance! >= results[index - 1].distance!,
    ),
  );

  assert.equal(
    getResults(venues, { query: "Leominster", filters: [], selected: "" })
      .length,
    0,
  );

  assert.equal(
    getResults(venues, {
      query: "The Board Room",
      filters: [],
      selected: "",
    })[0].venue.id,
    "board-room-bridgnorth",
  );
});

test("place matching handles whitespace and punctuation, and suggests spelling corrections", () => {
  assert.equal(resolvePlace("  MUCH   WENLOCK ")?.name, "Much Wenlock");

  assert.equal(resolvePlace("hjk"), undefined);

  assert.equal(getPlaceSuggestions("Shrewsbry")[0].name, "Shrewsbury");

  assert.equal(getPlaceSuggestions("Broesley")[0].name, "Broseley");

  assert.equal(getPlaceSuggestions("Brose")[0].name, "Broseley");
});

test("ambiguous place names require a choice that survives a shared URL", () => {
  assert.equal(resolvePlace("Oldbury"), undefined);

  const choice = getPlaceSuggestions("Oldbury").find(
    (place) => place.area === "Shropshire",
  )!;
  const state = {
    query: placeLabel(choice),
    near: choice.id,
    filters: [],
    selected: "",
  };
  const restored = parseDiscoveryState(discoveryUrl(state).slice(2));

  assert.equal(resolvePlace(restored.query, restored.near)?.id, choice.id);

  assert.equal(resolvePlace("Broseley", choice.id), undefined);

  assert.ok(getResults(venues, restored).length > 0);
});

test("release content contains real sourced destinations without invented availability", () => {
  assert.equal(venues.length, 3);

  assert.equal(
    venues.filter((venue) => venue.classification === "general-retailer")
      .length,
    2,
  );

  const smyths = venues.find((venue) => venue.id === "smyths-telford")!;

  assert.equal(smyths.products["board-games"].status, "unknown");

  assert.equal(smyths.services["casual-play"].status, "unknown");

  assert.equal(
    getResults(venues, {
      query: "",
      filters: ["board-games", "casual-play"],
      selected: "",
    }).length,
    0,
  );
});

test("a confirmed absence cannot satisfy a positive offering filter", () => {
  const unavailable = {
    ...venues[1],
    products: {
      ...venues[1].products,
      "board-games": {
        status: "known",
        value: false,
        evidenceIds: ["centre"],
        confirmedOn: "2026-10-15",
      },
    },
  } satisfies (typeof venues)[number];

  assert.deepEqual(
    getResults([unavailable], {
      query: "",
      filters: ["board-games"],
      selected: "",
    }),
    [],
  );
});
