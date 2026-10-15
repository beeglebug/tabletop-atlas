import "server-only";
import { venues } from "@/content/venues";

/** Published read boundary. V1 reads local content during pre-rendering. */
export function getPublishedVenues() {
  return venues;
}

export function getVenueBySlug(slug: string) {
  return venues.find((venue) => venue.slug === slug);
}
