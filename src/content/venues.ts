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
    id: "waterstones-telford",
    slug: "waterstones-telford",
    name: "Waterstones Telford",
    town: "Telford",
    classification: "general-retailer",
    summary:
      "A town-centre bookshop whose local centre listing advertises a games range. A browsing stop alongside the books.",
    editorialNote:
      "Telford Centre advertises games at this branch. Specific titles, trading cards and play facilities have not been checked. Ask the shop about a particular game before making a special trip.",
    coordinates: known(
      { latitude: 52.6766164, longitude: -2.4467826 },
      ["location"],
      "2026-10-15",
    ),
    coordinateNote:
      "Approximate shopping-centre location; not an entrance pin. Use the street address to find the shop.",
    address: known(
      "219 Dean Street, Telford Centre, Telford",
      ["centre"],
      "2026-10-15",
    ),
    website: "https://www.waterstones.com/bookshops/telford",
    products: {
      ...products,
      "board-games": known(true, ["centre"], "2026-10-15"),
    },
    services,
    practical,
    evidence: [
      {
        id: "centre",
        kind: "published",
        url: "https://www.telfordcentre.com/brands/waterstones/",
        title: "Local branch and games listing",
        publisher: "Telford Centre",
        checkedOn: "2026-10-15",
        note: "The centre lists the branch address and a games range. This supports general games browsing, not availability of any particular title or trading cards. Centre hours are not treated as branch hours.",
      },
      {
        id: "location",
        kind: "published",
        url: "https://www.ukmalls.co.uk/shopping-centres/england/west-midlands/shropshire/telford-shopping-centre/waterstones",
        title: "Shopping-centre map reference",
        publisher: "UK Malls Online",
        checkedOn: "2026-10-15",
        note: "Coordinates describe the shopping centre, not the shop entrance. Used only for approximate regional discovery.",
      },
    ],
  },
  {
    id: "smyths-telford",
    slug: "smyths-toys-telford",
    name: "Smyths Toys Telford",
    town: "Telford",
    classification: "general-retailer",
    summary:
      "A toy superstore at Telford Bridge Retail Park. Check the retailer’s board-game range and select Telford for local availability before travelling.",
    editorialNote:
      "Smyths publishes a national board-game catalogue and offers collection at Telford. That does not confirm which games are on this branch’s shelves today. Local board-game stock, trading cards, singles and play space remain unchecked.",
    coordinates: known(
      { latitude: 52.678759, longitude: -2.454627 },
      ["location"],
      "2026-10-15",
    ),
    coordinateNote:
      "Approximate retail-park postcode location; not an entrance pin. Follow the address and store signage.",
    address: known(
      "Unit 3, Telford Bridge Retail Park, Colliers Way, Telford, TF3 4PB",
      ["store"],
      "2026-10-15",
    ),
    website:
      "https://www.smythstoys.com/uk/en-gb/storefinder/storedetails/telford",
    products,
    services: {
      ...services,
      "step-free-access": known(true, ["store"], "2026-10-15"),
    },
    practical: {
      hours: known(
        "Published regular hours: Monday–Friday 09:00–20:00; Saturday 09:00–19:00; Sunday 10:30–16:30. Check the store page for changes and holiday hours.",
        ["store"],
        "2026-10-15",
      ),
      booking: unknown,
      accessibility: known(
        "The store page lists wheelchair access and disabled parking. Contact the branch about your specific requirements.",
        ["store"],
        "2026-10-15",
      ),
    },
    evidence: [
      {
        id: "store",
        kind: "published",
        url: "https://www.smythstoys.com/uk/en-gb/storefinder/storedetails/telford",
        title: "Official Telford store listing",
        publisher: "Smyths Toys",
        checkedOn: "2026-10-15",
        note: "Supports address, regular hours, collection and published wheelchair access/disabled parking. Does not establish tabletop play facilities or current game stock.",
      },
      {
        id: "catalogue",
        kind: "published",
        url: "https://www.smythstoys.com/uk/en-gb/toys/games-puzzles-and-books/board-games/c/SM06010616",
        title: "National board-game catalogue",
        publisher: "Smyths Toys",
        checkedOn: "2026-10-15",
        note: "National range only. Select Telford on the retailer’s site to check availability. No branch-level product claim is inferred from this catalogue.",
      },
      {
        id: "location",
        kind: "published",
        url: "https://www.ukpostcodecheck.com/postcode/tf3-4pb",
        title: "Retail-park postcode location",
        publisher: "UK Postcode Check",
        checkedOn: "2026-10-15",
        note: "Approximate postcode coordinates, not a surveyed storefront or entrance.",
      },
    ],
  },
];
