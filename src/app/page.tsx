import { Discovery } from "@/components/discovery/discovery";
import { getPublishedVenues } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="discovery-hero">
        <p className="eyebrow">A field guide to our corner of Shropshire</p>
        <h1>
          Find your next
          <br />
          <em>favourite table.</em>
        </h1>
        <p>Browse a binder. Learn a new game. Find somewhere you belong.</p>
      </section>
      <Discovery venues={getPublishedVenues()} />
      <aside className="community-note">
        <span className="mini-stamp">A growing guide</span>
        <h2>Good places deserve good field notes.</h2>
        <p>
          We’re starting small, with published sources and honest gaps.
          Community tips and first-hand confirmations are coming later.
        </p>
      </aside>
    </>
  );
}
