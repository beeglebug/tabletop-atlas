# Milestone 1 evidence — 15 October 2026

## Status

Local foundation and adapter/runtime validation pass. **Remote deployment gate remains open.** `wrangler whoami` reports no authenticated account. No repository connection, deployment, custom domain or DNS change has been performed. No deployed CPU, latency, or cost measurements are claimed.

## Verified environment and results

macOS, Node 22.23.3, npm lockfile; Next.js 16.3.8, OpenNext Cloudflare 1.20.11, Wrangler 4.151.0. Use Node 22 rather than the shell's default Node 20.

- `npm run check`: ESLint and TypeScript pass.
- `npm run build:worker`: production Next.js build and OpenNext transformation pass. `/` is static, `/venues/demo-field-guide` is SSG through `generateStaticParams`.
- `npm run preview`, then `npm run smoke`: real HTTP checks against local workerd pass. Home and profile return 200 and include server-rendered content, demo disclosure, and a working stylesheet. Missing profile and unrelated missing path return 404 with recovery text.
- Browser review: home renders with the field-guide palette and typography; clicking the profile link navigates successfully and updates its page title. Pressing Return on “Sources & updates” expands its content in the accessibility tree. This is a limited foundation check, not a complete accessibility or mobile audit.
- `wrangler deploy --dry-run --outdir /tmp/tabletop-atlas-worker-check`: configuration/bundling passes without uploading. Worker upload 4276.37 KiB, gzip 883.14 KiB; 36 asset files observed. These local sizes are not remote performance measurements.

## Compatibility findings

The initially resolved Next.js 16.4.1 built successfully but failed during local Worker requests with `Unexpected loadManifest(...preview-props.json)`. Pinned Next.js and eslint-config-next to 16.3.8, satisfying the adapter's supported peer range. A considered 16.2 version did not satisfy the current adapter's peer range and is not used.

The initial no-cache configuration built but returned 404 for the pre-rendered dynamic profile. The [documented SSG configuration](https://opennext.js.org/cloudflare/caching) uses `staticAssetsIncrementalCache` plus cache interception. That configuration now serves the profile correctly from deployment assets without R2, D1, queues or tag-cache resources. ISR is unsupported by this chosen read-only cache; updates require rebuild/deploy. Keep the HTTP profile check when changing framework or adapter versions: a successful build is insufficient evidence.

## Cost and security constraints

[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) checked on 15 October 2026 lists Workers Free at 100,000 requests/day and 10 ms CPU per invocation. Static content reduces rendering work, but request routing and unknown paths still need remote measurement. Check actual account plan and current bundle/startup limits during deployment. The local dry run does not establish remote eligibility or CPU compliance. No storage subscription is required by this configuration.

Installation audit initially reported 9 high findings. A scoped override updates `@node-minify/core`'s glob dependency to compatible `^10.5.0`, removing that known CLI advisory chain. Five high audit findings remain in the lint tooling chain (`eslint-config-next` → Next ESLint plugin → fast-glob → micromatch → braces). The registry currently exposes braces 3.0.3 as latest while the advisory flags <=3.0.3; no compatible patched release was available. Do not blindly apply npm's suggested major downgrade. These are development tooling dependencies, not venue-data request handling. Revisit with upstream patched releases; the audit is not clean.

## Next deployment verification

Authenticate with Cloudflare and connect the intended GitHub repository using README instructions. Deploy to workers.dev and repeat smoke checks with `SMOKE_BASE_URL=https://<actual-worker-host> npm run smoke`; verify browser navigation, static asset cache headers, and logs/CPU metrics. Check direct profile URLs and unknown URLs from a fresh browser session. Only then mark the representative remote deployment gate passed. Custom-domain configuration and deployed performance/a11y evidence remain pending.
