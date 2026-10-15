import type { Fact, PublishedVenue } from "./types";

const unknown = {
  status: "unknown",
  reason: "not-checked",
  evidenceIds: [],
} as const;
const demoFact = <T>(value: T): Fact<T> => ({
  status: "known",
  value,
  evidenceIds: [],
  confirmedOn: null,
});

/** Fictional test content. Never substitute these claims for real local research. */
export const venues: readonly PublishedVenue[] = [
  {
    id: "demo-field-guide",
    slug: "demo-field-guide",
    name: "The Sample Table",
    town: "Example town",
    classification: "tabletop-venue",
    contentKind: "demo",
    summary:
      "A fictional venue for trying out the field guide. This is not a real business or a recommendation.",
    coordinates: demoFact({ latitude: 52.6, longitude: -2.4 }),
    address: unknown,
    products: {
      "sealed-cards": demoFact(true),
      "singles-binders": unknown,
      "singles-cabinet": unknown,
      "singles-terminal": unknown,
      "board-games": demoFact(true),
      "rpg-books": unknown,
      miniatures: unknown,
      paints: unknown,
    },
    services: {
      "casual-play": demoFact(true),
      "organised-play": unknown,
      "board-game-library": unknown,
      "bookable-tables": unknown,
      "step-free-access": unknown,
    },
    evidence: [],
  },
];
