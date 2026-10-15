import Link from "next/link";

export default function NotFound() {
  return (
    <section className="profile">
      <p className="eyebrow">An uncharted page</p>
      <h1>Place not found.</h1>
      <p>This page isn’t in the current edition of the guide.</p>
      <Link className="text-link" href="/">
        Return to the guide →
      </Link>
    </section>
  );
}
