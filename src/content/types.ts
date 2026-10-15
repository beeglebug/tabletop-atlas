/** Evidence dates describe editorial actions, never build/cache timestamps. */
export type ISODate = `${number}-${number}-${number}`;
export type Evidence =
  | { id: string; kind: "published"; url: string; title: string; publisher: string; checkedOn: ISODate; publishedOn?: ISODate; updatedOn?: ISODate }
  | { id: string; kind: "first-hand"; publicContributor: string; observedOn: ISODate | null; submittedOn: ISODate; editedOn?: ISODate; report: string };
export type Fact<T> =
  | { status: "known"; value: T; evidenceIds: readonly string[]; confirmedOn: ISODate | null }
  | { status: "unknown"; reason: "not-checked" | "conflicting-evidence"; evidenceIds: readonly string[] };
export type Product = "sealed-cards" | "singles-binders" | "singles-cabinet" | "singles-terminal" | "board-games" | "rpg-books" | "miniatures" | "paints";
export type Service = "casual-play" | "organised-play" | "board-game-library" | "bookable-tables" | "step-free-access";
export interface PublishedVenue {
  id: string;
  slug: string;
  name: string;
  town: string;
  classification: "tabletop-venue" | "general-retailer" | "club";
  contentKind: "curated" | "demo";
  summary: string;
  coordinates: Fact<{ latitude: number; longitude: number }>;
  address: Fact<string>;
  products: Record<Product, Fact<boolean>>;
  services: Record<Service, Fact<boolean>>;
  evidence: readonly Evidence[];
}
