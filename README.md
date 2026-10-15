# Tabletop Atlas

A community field guide to tabletop shops and venues around Telford, Bridgnorth and Shifnal. This repository currently implements the milestone 1 foundation from [PLAN.md](PLAN.md). The only profile is explicitly fictional development content; real venue listings, maps, search and filters arrive in later milestones.

## Local setup

Use Node 22 (`nvm use`, see `.nvmrc`) and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The representative profile is `/venues/demo-field-guide`.

```sh
npm run check          # ESLint and TypeScript
npm run build          # Next.js production build
npm run build:worker   # Next.js build + OpenNext adapter
npm run preview        # serve existing adapter build in local Workers runtime
npm run smoke          # in a second terminal; defaults to http://localhost:8787
```

`npm run start` serves the Next.js production build with Node. Workers preview is the deployment compatibility check. Rebuild before previewing changed source.

## Architecture and curated updates

App Router server components read published content through `src/lib/content.ts`. Local fixtures live in `src/content/venues.ts`; content types are in `src/content/types.ts`. The home page and known profile paths are pre-rendered at build time. Unknown profile slugs return 404. No database, account, R2 bucket, runtime content fetch, or map JavaScript is needed for this milestone.

To publish an editorial update:

1. Edit the typed dataset. Preserve stable IDs; treat changing a slug as a future redirect concern.
2. Add published-source or first-hand evidence with its actual dates. Associate each supported claim with evidence IDs. Unknown facts stay unknown; `false` explicitly means confirmed absence. Never use a build date as a confirmation date. Fictional fixtures must retain their demo label.
3. Run checks, build the Worker, preview it, and run the smoke checks. Review rendered content and source disclosures before release.
4. Commit source and `package-lock.json`, push to the connected repository, and allow Cloudflare Workers Builds to build and deploy.
5. Verify public home/profile links, missing-page 404s and assets. Updates appear after a successful deployment; failed builds leave the previous edition live.

A future database would be an authoritative editing store, with accepted changes regenerating public read representations. Submissions, moderation, ISR and cache invalidation are proposed, not implemented.

## Cloudflare dashboard deployment

Remote deployment is pending authentication and a repository connection. This directory did not initially contain a Git repository; no GitHub repository or DNS record has been created.

In Cloudflare Workers Builds, connect this project's repository and use Node 22 (for example `NODE_VERSION=22.23.3`), build command `npm run build:worker`, deploy command `npm run deploy`, and root directory `/`. npm uses the committed lockfile for installation. The Worker name must match `tabletop-atlas` in `wrangler.jsonc`, including the self-service binding. First verify the provided workers.dev address. Later attach the confirmed custom domain through the dashboard once DNS/account access is established; no `basePath` is required.

For a manual deploy after `npx wrangler login`, run `npm run build:worker` then `npm run deploy`. Deploy is a separate command so a known build can be reviewed first. Do not commit secrets or Wrangler local state.

No billable storage resources are configured. Workers Free CPU and bundle limits still require remote validation; pre-rendering alone does not guarantee every request fits the free allowance. See [verification evidence](docs/VERIFICATION.md) and the [decision journal](docs/DECISIONS.md).

## Current boundaries

This is a foundation preview, with indexing disabled until real curated content is ready. Design and content taxonomy remain open to refinement. There are no working submission, search, geolocation or map controls yet. Real venue photography, provenance presentation, accessibility audits and deployed performance measurements belong to subsequent milestones.
