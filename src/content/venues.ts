import type { Fact, Product, PublishedVenue, Service } from "./types";

const unknown = {
  status: "unknown",
  reason: "not-checked",
  evidenceIds: [],
} as const;
const known = <T>(
  value: T,
  evidenceIds: string[] = [],
  confirmedOn: `${number}-${number}-${number}` | null = null,
): Fact<T> => ({ status: "known", value, evidenceIds, confirmedOn });
const products: Record<Product, Fact<boolean>> = {
  "sealed-cards": unknown,
  "singles-binders": unknown,
  "singles-cabinet": unknown,
  "singles-terminal": unknown,
  "board-games": unknown,
  "rpg-books": unknown,
  miniatures: unknown,
  paints: unknown,
};
const services: Record<Service, Fact<boolean>> = {
  "casual-play": unknown,
  "organised-play": unknown,
  "board-game-library": unknown,
  "bookable-tables": unknown,
  "step-free-access": unknown,
};
const practical = { hours: unknown, booking: unknown, accessibility: unknown };

export const venues: readonly PublishedVenue[] = [
  {
    id: "board-room-bridgnorth",
    slug: "the-board-room-bridgnorth",
    name: "The Board Room",
    town: "Bridgnorth",
    classification: "tabletop-venue",
    contentKind: "curated",
    summary:
      "A board game café on Whitburn Street, with bookable play sessions. A place to make an afternoon of a game.",
    editorialNote:
      "The venue’s booking listing offers timed play sessions. Its board game library is also described by Safe Places Shropshire, in a listing last updated in September 2024. We haven’t checked the shelves in person: singles, current stock and organised card play still need a closer look.",
    coordinates: known({ latitude: 52.5360597, longitude: -2.4220471 }, [
      "booking",
    ]),
    address: known(
      "14 Whitburn Street, Bridgnorth, Shropshire, WV16 4QN",
      ["official"],
      "2026-10-15",
    ),
    website: "https://theboardroombridgnorth.co.uk/",
    bookingUrl: "https://the-board-room.letsbookfor.com/",
    products,
    services: {
      ...services,
      "casual-play": known(true, ["booking"], "2026-10-15"),
      "bookable-tables": known(true, ["official", "booking"], "2026-10-15"),
      "board-game-library": known(true, ["safe-places"], "2024-09-01"),
    },
    practical: {
      hours: {
        status: "unknown",
        reason: "conflicting-evidence",
        evidenceIds: ["booking", "safe-places"],
      },
      booking: known(
        "Online play-session booking is available. Check with the venue about walk-ins and current prices.",
        ["official", "booking"],
        "2026-10-15",
      ),
      accessibility: known(
        "The booking listing mentions wheelchair access; an older Safe Places listing describes level access. Contact the venue about your specific access needs.",
        ["booking", "safe-places"],
        "2026-10-15",
      ),
    },
    evidence: [
      {
        id: "official",
        kind: "published",
        url: "https://theboardroombridgnorth.co.uk/",
        title: "Venue website",
        publisher: "The Board Room",
        checkedOn: "2026-10-15",
        note: "Supports the name, address and online booking link. Publication date not supplied.",
      },
      {
        id: "booking",
        kind: "published",
        url: "https://letsbookfor.com/venues/the-board-room",
        title: "Venue booking listing",
        publisher: "LetsBookFor",
        checkedOn: "2026-10-15",
        note: "Supports café classification, play bookings, coordinates and the published access description. Opening times differ from the older Safe Places listing; hours remain unresolved.",
      },
      {
        id: "safe-places",
        kind: "published",
        url: "https://safeplacesshropshire.com/listing/the-boardroom/",
        title: "Local access and games listing",
        publisher: "Safe Places Shropshire",
        checkedOn: "2026-10-15",
        updatedOn: "2024-09-01",
        note: "Older evidence for the game library and level access. The page’s stated update date is retained; checking the page today does not make its observations current.",
      },
    ],
  },
  {
    id: "demo-field-guide",
    slug: "demo-field-guide",
    name: "The Sample Table",
    town: "Shifnal",
    classification: "tabletop-venue",
    contentKind: "demo",
    summary:
      "A fictional games shop with browseable singles binders and casual play. Built to try out the guide, not a real destination.",
    editorialNote:
      "An illustrative example of a dedicated tabletop shop. All offerings and the map position are invented for development. No real business is represented.",
    coordinates: known({ latitude: 52.667, longitude: -2.372 }),
    address: unknown,
    products: {
      ...products,
      "singles-binders": known(true),
      "sealed-cards": known(true),
      "board-games": known(true),
    },
    services: { ...services, "casual-play": known(true) },
    practical,
    evidence: [],
  },
  {
    id: "demo-high-street",
    slug: "demo-high-street",
    name: "High Street Books & Games",
    town: "Telford",
    classification: "general-retailer",
    contentKind: "demo",
    summary:
      "A fictional general retailer selling board games and sealed cards. Shopping does not imply a space to play.",
    editorialNote:
      "This fictional profile illustrates the distinction between a shop with tabletop products and a dedicated play venue. Its products, services and map position are demo data.",
    coordinates: known({ latitude: 52.678, longitude: -2.445 }),
    address: unknown,
    products: {
      ...products,
      "board-games": known(true),
      "sealed-cards": known(true),
      "singles-binders": known(false),
    },
    services: {
      ...services,
      "casual-play": known(false),
      "bookable-tables": known(false),
    },
    practical,
    evidence: [],
  },
];
