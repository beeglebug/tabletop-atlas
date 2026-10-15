import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "@/components/ui/external-link-icon";
import { SourceLinks } from "@/components/venues/source-links";
import { FactDetails, factText } from "@/components/venues/fact-details";
import type { Fact } from "@/content/types";
import { getPublishedVenues, getVenueBySlug } from "@/lib/content";
import {
  formatDate,
  productLabels,
  serviceLabels,
  typeLabels,
  venueTags,
} from "@/lib/discovery";

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
    alternates: venue ? { canonical: `/venues/${venue.slug}` } : undefined,
    openGraph: venue
      ? {
          title: venue.name,
          description: venue.summary,
          type: "website",
          locale: "en_GB",
          siteName: "Tabletop Atlas",
          url: `/venues/${venue.slug}`,
        }
      : undefined,
  };
}

function PracticalFact({ title, fact }: { title: string; fact: Fact<string> }) {
  return (
    <div>
      <dt>{title}</dt>
      <dd>
        {fact.status === "known"
          ? fact.value
          : fact.reason === "conflicting-evidence"
            ? "Published sources differ. Check directly with the venue before travelling."
            : "Not checked — contact the venue before travelling."}
        <FactDetails fact={fact} />
      </dd>
    </div>
  );
}

function OfferingFacts({
  title,
  facts,
  labels,
}: {
  title: string;
  facts: Record<string, Fact<boolean>>;
  labels: Record<string, string>;
}) {
  return (
    <section>
      <h2>{title}</h2>
      <dl>
        {Object.entries(facts).map(([key, fact]) => (
          <div key={key}>
            <dt>{labels[key]}</dt>
            <dd>
              {factText(fact)}
              <FactDetails fact={fact} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const venue = getVenueBySlug((await params).slug);

  if (!venue) notFound();

  const publishedSources = venue.evidence.filter(
    (source) => source.kind === "published",
  );
  const latestCheck = publishedSources
    .map((source) => source.checkedOn)
    .sort()
    .at(-1);

  return (
    <article className="profile">
      <SourceLinks />
      <Link className="text-link" href="/">
        ← Back to discovery
      </Link>
      <header className="profile-header">
        <p className="eyebrow">
          {venue.town} / {typeLabels[venue.classification]}
        </p>
        <h1>{venue.name}</h1>
        <p className="intro">{venue.summary}</p>
        <ul className="tags" aria-label="Known offerings">
          {venueTags(venue).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </header>
      <div className="freshness-note">
        <span className="mini-stamp">Published sources</span>
        <p>
          {latestCheck && (
            <>
              Published information last checked on{" "}
              <time dateTime={latestCheck}>{formatDate(latestCheck)}</time>
              .{" "}
            </>
          )}
          Individual evidence dates vary.{" "}
          {!venue.evidence.some((source) => source.kind === "first-hand") &&
            "No first-hand visit is recorded. "}
          <a href="#sources">Inspect sources & updates ↓</a>
        </p>
      </div>
      <div className="profile-grid">
        <div>
          <section className="field-note">
            <p className="eyebrow">The field note</p>
            <h2>A little local context</h2>
            <p>{venue.editorialNote}</p>
          </section>
          <div className="facts-grid">
            <OfferingFacts
              title="Browse & buy"
              facts={venue.products}
              labels={productLabels}
            />
            <OfferingFacts
              title="Stay & play"
              facts={venue.services}
              labels={serviceLabels}
            />
          </div>
          <p className="unknown-note">
            “Not checked” means we don’t yet know. It does not mean the venue
            doesn’t offer it.
          </p>
        </div>
        <aside className="visit-card">
          <p className="eyebrow">Before you set out</p>
          <h2>Plan a visit</h2>
          <dl>
            <PracticalFact title="Address" fact={venue.address} />
            <PracticalFact title="Opening hours" fact={venue.practical.hours} />
            <PracticalFact title="Booking" fact={venue.practical.booking} />
            <PracticalFact
              title="Accessibility"
              fact={venue.practical.accessibility}
            />
          </dl>
          {venue.coordinateNote && (
            <p className="unknown-note">{venue.coordinateNote}</p>
          )}
          {venue.website && (
            <a className="outline-button" href={venue.website}>
              Visit venue website <ExternalLinkIcon />
            </a>
          )}
          {venue.bookingUrl && (
            <a className="text-link" href={venue.bookingUrl}>
              Check bookings with the venue <ExternalLinkIcon />
            </a>
          )}
          <Link className="text-link" href={`/?place=${venue.id}`}>
            Locate in the guide →
          </Link>
        </aside>
      </div>
      <details id="sources" className="source-disclosure">
        <summary>
          Sources & updates{" "}
          <span>
            {venue.evidence.length}{" "}
            {venue.evidence.length === 1 ? "source" : "sources"}
          </span>
        </summary>
        <p>
          Manually curated information. A source tells you where a claim came
          from; it doesn’t guarantee it is still current. Checking a page is
          different from visiting a venue.
        </p>
        {venue.evidence.map((source) => (
          <article
            key={source.id}
            id={`source-${source.id}`}
            tabIndex={-1}
            className="source-entry"
          >
            {source.kind === "published" ? (
              <>
                <p className="eyebrow">
                  Published information · {source.publisher}
                </p>
                <h3>
                  <a href={source.url}>
                    {source.title} <ExternalLinkIcon />
                  </a>
                </h3>
                <p>
                  Page checked on{" "}
                  <time dateTime={source.checkedOn}>
                    {formatDate(source.checkedOn)}
                  </time>
                  .{" "}
                  {source.updatedOn ? (
                    <>
                      Source last updated on{" "}
                      <time dateTime={source.updatedOn}>
                        {formatDate(source.updatedOn)}
                      </time>
                      .
                    </>
                  ) : (
                    "Source update date not supplied."
                  )}
                  {source.publishedOn && (
                    <> Published on {formatDate(source.publishedOn)}.</>
                  )}
                </p>
                <p>{source.note}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">
                  First-hand report · {source.publicContributor}
                </p>
                <p>{source.report}</p>
                <p>
                  {source.observedOn
                    ? `Observed on ${formatDate(source.observedOn)}.`
                    : "Visit date not supplied."}{" "}
                  Submitted on {formatDate(source.submittedOn)}.
                  {source.editedOn &&
                    ` Edited on ${formatDate(source.editedOn)}.`}
                </p>
              </>
            )}
          </article>
        ))}
      </details>
      <aside className="community-note">
        <p className="eyebrow">More field notes, in time</p>
        <h2>Know this place well?</h2>
        <p>
          Community contributions are coming later. For now, this guide is a
          small editorial collection with its sources left open.
        </p>
      </aside>
    </article>
  );
}
