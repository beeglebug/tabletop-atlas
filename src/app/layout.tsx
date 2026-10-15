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
          <span className="stamp">In the making</span>
        </header>
        <main id="main">{children}</main>
        <footer>
          Made for curious players. Built with local knowledge.
          <span>Development preview · Fictional example content</span>
        </footer>
      </body>
    </html>
  );
}
