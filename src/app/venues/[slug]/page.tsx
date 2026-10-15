import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedVenues, getVenueBySlug } from "@/lib/content";
import type { Fact } from "@/content/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedVenues().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const venue = getVenueBySlug((await params).slug);

  return {
    title: venue?.name ?? "Place not found",
    description: venue?.summary,
  };
}

function factLabel(fact: Fact<boolean>) {
  return fact.status === "unknown"
    ? "Not checked"
    : fact.value
      ? "Available (demo)"
      : "Unavailable (demo)";
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const venue = getVenueBySlug((await params).slug);

  if (!venue) notFound();

  return (
    <article className="profile">
      <Link className="text-link" href="/">
        ← Back to the guide
      </Link>
      <p className="eyebrow profile-label">Fictional demo · Tabletop venue</p>
      <h1>{venue.name}</h1>
      <p className="intro">{venue.summary}</p>
      <div className="notice">
        Example content only. Coordinates and available offerings are
        illustrative. No real venue information has been verified.
      </div>
      <div className="facts-grid">
        <section>
          <h2>Browse & buy</h2>
          <dl>
            {Object.entries(venue.products).map(([key, fact]) => (
              <div key={key}>
                <dt>{key.replaceAll("-", " ")}</dt>
                <dd>{factLabel(fact)}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h2>Stay & play</h2>
          <dl>
            {Object.entries(venue.services).map(([key, fact]) => (
              <div key={key}>
                <dt>{key.replaceAll("-", " ")}</dt>
                <dd>{factLabel(fact)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <details>
        <summary>Sources & updates</summary>
        <p>
          This fictional fixture has no source history or confirmation date.
          Real profiles will link facts to published sources or dated first-hand
          reports. A build date does not confirm venue information.
        </p>
      </details>
    </article>
  );
}
