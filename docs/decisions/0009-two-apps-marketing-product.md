# ADR 0009 — Two Apps: Marketing (Next.js) + Product (Expo)

**Status:** Accepted
**Date:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

After deciding to use Expo for the product app (ADR 0001 v2), the question arose: should the marketing site (landing, pricing, legal pages) also be built in Expo, or remain Next.js?

The two have fundamentally different requirements.

## Decision

**Apex consists of two separate applications in one monorepo:**

1. **Marketing Site** — Next.js 15 hosted on Vercel at `apex.[domain]`
2. **Product App** — Expo SDK 52 with web/iOS/Android/desktop outputs at `app.apex.[domain]`

Both share design tokens, types, validation schemas, and i18n strings via monorepo packages.

## Rationale

### The Two Apps Have Different Jobs

| Aspect                | Marketing Site                          | Product App                        |
| --------------------- | --------------------------------------- | ---------------------------------- |
| **Audience**          | Anonymous visitors                      | Authenticated users                |
| **Primary goal**      | Convert visits to signups               | Help users execute on their goals  |
| **Update cadence**    | Slow (every few weeks post-launch)      | Fast (weekly during dev)           |
| **SEO importance**    | Critical                                | Irrelevant (gated by auth)         |
| **Performance focus** | First Contentful Paint < 1.5s           | Smooth interactions, offline-first |
| **Bundle size**       | Critical (< 80KB JS)                    | Tolerable (350KB JS for app)       |
| **Distribution**      | Web only                                | Web + iOS + Android + desktop      |
| **Offline support**   | Not needed                              | Required                           |
| **Content type**      | Static marketing copy + occasional blog | Dynamic user data                  |

A single codebase optimizing for both forces compromises that hurt one or the other.

### Forcing Marketing into Expo Web Would Hurt SEO

Expo's React Native Web outputs DOM-rendered components but not in an SEO-optimal way. It does not produce semantic HTML in the way Next.js Server Components do. Crawlers see less structured content, page weight is higher.

For an app gated behind authentication, this doesn't matter. For a marketing site that needs to rank for "best productivity app for solo founders" and similar terms, it matters significantly.

### Forcing Product App into Next.js Would Hurt Mobile + Offline

This was the v1 plan and the reason for ADR 0001 v2. Next.js's server-driven architecture fights offline-first. Capacitor wrappers ceiling at webview performance. Both are rejected.

### Splitting Is the Solo-Founder Win

Two small apps, each optimal for its job:

- Marketing: ~10 pages of marketing copy, mostly static. Petja can iterate it in 1 week.
- Product: ~30 pages of authenticated app, complex state, deep functionality. Built across 25+ phases.

Splitting them reduces cognitive load (each codebase has one job) and accelerates iteration (changing pricing copy doesn't require rebuilding the entire product app).

## What Stays Shared

The monorepo allows real code sharing where it matters:

```
packages/
├── design-tokens/      # tokens.ts → Tailwind preset (marketing) + theme provider (product)
├── ui/                 # shared component primitives where cross-platform makes sense
├── types/              # database.types.ts (Supabase generated)
├── i18n/               # en.json + de.json (single source for both apps)
└── lib/                # validation schemas (Zod), pure utility functions
```

This means:

- **Branding consistency** — colors, fonts, spacing match exactly between marketing and app
- **Translation consistency** — "Sign up" / "Anmelden" identical across both
- **Type safety end-to-end** — Database types flow from Supabase → packages/types → both apps
- **No duplication** — Validation schemas defined once, used in marketing forms and product app

## Auth Flow Across Apps

```
1. User visits apex.[domain] (marketing)
2. Clicks "Get Started"
3. Redirected to apex.[domain]/sign-up (still marketing site, Next.js)
4. Submits form → Supabase Auth signs them up
5. Email verification link → returns to marketing site
6. After verification, redirected to app.apex.[domain] (product app)
7. Product app reads JWT cookie shared across subdomain (.apex.[domain])
8. User is in the product
```

**Cookie sharing:** Setting Supabase session cookie at `.apex.[domain]` (note leading dot) shares it across `apex.[domain]` and `app.apex.[domain]`.

For Stage 1 (when running locally), simulated via different localhost ports.

## Stripe Flow Across Apps

```
1. User in product app clicks "Upgrade to Pro"
2. Product app calls Supabase Edge Function: createCheckoutSession
3. Edge Function returns Stripe Checkout URL
4. User redirected to Stripe-hosted page
5. Pays
6. Stripe webhook → Edge Function → updates workspace.plan = 'pro'
7. Stripe success_url returns user to app.apex.[domain]/billing/success
8. Product app shows confirmation, PowerSync re-syncs workspace
```

Stripe Customer Portal also handled by Edge Function. User clicks "Manage subscription" → Edge Function returns portal URL → user redirected → returns to app on completion.

**Why not Marketing Site for Stripe?** Either app could host Stripe redirect, but keeping it in Product App means authenticated users stay in the authenticated context (less confusing UX).

## Deployment Topology

```
apex.[domain]               → Vercel (Next.js marketing)
app.apex.[domain]           → Vercel (Expo Web export)
api.apex.[domain]           → Supabase Edge Functions (server logic)
db.apex.[domain]            → Supabase Postgres (not directly exposed)
sync.apex.[domain]          → PowerSync Service (managed)
```

DNS managed via Cloudflare.

## Trade-Offs

### Positive

- Each app optimizes for its job
- Faster iteration on marketing without rebuilding product
- SEO and offline concerns each handled correctly
- Standard pattern (Linear, Cal.com, Vercel itself, all use this split)

### Negative

- Two deploy pipelines (mitigated: both on Vercel, Turborepo caches)
- Auth requires shared cookie domain (one-time setup)
- Stripe session handoff between apps (handled via redirect URLs)

### Mitigations

- Monorepo packages prevent duplication of design/types/i18n
- Auth cookie sharing solved by cookie domain config
- Local dev: Turborepo runs both apps with single command

## What Triggers Revisiting

- If marketing site grows beyond simple pages and needs product-app interactivity
- If maintaining two apps becomes a real burden (likely won't, given different update cadences)

## References

- [Vercel's own architecture: docs/marketing/app split](https://vercel.com/blog/nextjs-app-router)
- [Cal.com architecture: marketing.cal.com vs app.cal.com](https://cal.com/blog)
- [Turborepo monorepo patterns](https://turbo.build/repo/docs)
