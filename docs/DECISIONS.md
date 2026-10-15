# Implementation journal

## 15 October 2026 — milestone 1 foundation

**Decision:** use actual Next.js App Router with OpenNext for Workers, rather than a framework substitute or static export. Server components read typed local data through `src/lib/content.ts`; `generateStaticParams` pre-renders the example profile, and unknown slugs return 404. No database or request-time content fetch is required. Updating data requires a new build and deployment. ISR and database publishing remain proposed future work.

**Content:** stable IDs are distinct from URL slugs. Venue classification, products and services are separate. A boolean false means confirmed absence; missing knowledge has an explicit unknown state. Claims reference evidence IDs and separate confirmation dates. Published sources distinguish checked/published/updated dates; visitor reports distinguish observed/submitted/edited dates. Build timestamps never refresh evidence. The sole fixture is a clearly fictional venue, including illustrative coordinates, with no invented citations or confirmation dates. Real venue curation is deferred to milestones 2–3.

**UI:** warm cream, forest green, restrained orange and system Georgia/sans fonts establish a small field-guide shell. System fonts avoid external font fetches during builds. Native source disclosure provides keyboard behaviour without client JavaScript. Base UI/shadcn provides the interactive component foundation; maps and discovery interactions are deferred to milestone 2.

**Deployment approach:** no R2, D1, image service, or incremental-cache resource is provisioned. Validate build-time content in the adapter and local workerd runtime before remote deployment. Local success alone does not establish Cloudflare account eligibility, remote latency, or Workers Free CPU compliance.

References consulted: [OpenNext setup](https://opennext.js.org/cloudflare/get-started), [supported Next.js versions](https://opennext.js.org/cloudflare), [shadcn Next.js setup](https://ui.shadcn.com/docs/installation/next), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

**Compatibility evidence:** the first latest-version build succeeded but failed real Worker requests. Next.js is now pinned to 16.3.8, and the documented read-only Workers Static Assets incremental cache with interception serves pre-rendered profiles. No R2 is needed. The local HTTP checks now pass; remote validation is explicitly pending account access. See [verification](VERIFICATION.md) for versions, failure details, bundle measurements, audit limitations and the deployment checklist. Revisit version pins only alongside Worker HTTP tests.
