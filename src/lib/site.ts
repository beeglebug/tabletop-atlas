/** Confirmed public hostname; override at build time for an alternate deployment. */
export const siteOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tabletop.stuartlee.dev",
).origin;
