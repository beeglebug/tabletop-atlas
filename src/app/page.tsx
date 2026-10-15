import Link from "next/link";
import { getPublishedVenues } from "@/lib/content";

export default function Home() {
  const venues = getPublishedVenues();

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Telford · Bridgnorth · Shifnal / coming soon</p>
        <h1>
          Find your next
          <br />
          <em>favourite table.</em>
        </h1>
        <p className="intro">
          Somewhere to browse a binder, roll the dice, or settle in for a game.
          A field guide to the tabletop places worth knowing.
        </p>
        <a className="action" href="#field-notes">
          Open the first field note <span aria-hidden="true">↗</span>
        </a>
        <p className="small-note">
          The foundation is here. Local discovery is next.
        </p>
      </section>
      <section id="field-notes" className="notes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / The first pages</p>
            <h2>A guide taking shape</h2>
          </div>
          <p>
            Real places need real evidence.
            <br />
            For now, explore a fictional example.
          </p>
        </div>
        {venues.map((venue) => (
          <article className="venue-card" key={venue.id}>
            <div className="card-art" aria-hidden="true">
              <span>
                FIELD
                <br />
                NOTES
              </span>
              <span className="art-number">№ 001</span>
            </div>
            <div className="card-copy">
              <p className="eyebrow">Fictional demo · Tabletop venue</p>
              <h3>
                <Link href={`/venues/${venue.slug}`}>{venue.name}</Link>
              </h3>
              <p>{venue.summary}</p>
              <Link className="text-link" href={`/venues/${venue.slug}`}>
                Read the example profile <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
        <aside className="editor-note">
          <h3>Local knowledge, with the receipts.</h3>
          <p>
            The guide will distinguish shopping from playing, unknown details
            from confirmed facts, and published information from first-hand
            visits. Community contributions are coming later.
          </p>
        </aside>
      </section>
    </>
  );
}
