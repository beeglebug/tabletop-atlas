import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteOrigin } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Tabletop Atlas — a local field guide",
    template: "%s | Tabletop Atlas",
  },
  description:
    "A field guide to places to browse, play, and find your tabletop community. Explore a small, sourced collection around Telford and Bridgnorth.",
  metadataBase: new URL(siteOrigin),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Tabletop Atlas",
    title: "Tabletop Atlas — a local field guide",
    description:
      "Sourced field notes for tabletop discovery around Telford and Bridgnorth.",
    url: "/",
  },
  twitter: { card: "summary" },
  robots: { index: true, follow: true },
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
