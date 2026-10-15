import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tabletop Atlas — a local field guide",
    template: "%s | Tabletop Atlas",
  },
  description:
    "A field guide to places to browse, play, and find your tabletop community. An early development preview.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="brand" href="/">
            Tabletop Atlas<span>A local field guide</span>
          </Link>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <span>© 2026 Tabletop Atlas</span>
          <details className="data-credits">
            <summary>Data credits</summary>
            <p>
              Regional place names and coordinates adapted from{" "}
              <a href="https://www.geonames.org/">GeoNames</a>, licensed under{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/">
                CC BY 4.0
              </a>
              . The regional extract was filtered and restructured for this
              guide.
            </p>
          </details>
        </footer>
      </body>
    </html>
  );
}
