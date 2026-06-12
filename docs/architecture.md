# Apex — Architecture & Tech Stack

> **Version:** v3 (post tech-audit)
> **Last reviewed:** 2026-05-03
> **Source of truth for all technical decisions.** Claude Code reads this before generating any structural code.

---

## Architecture Principle: Two Apps, One Backend, Five Distributions

Apex is **two separate codebases sharing one Supabase backend.** This is intentional. See ADR 0009 for full reasoning.

```
                ┌──────────────────────────────────┐
                │   apex.[domain]                  │
                │   ────────────                   │
                │   Marketing Site                 │
                │   Next.js 15 + Vercel            │
                │                                  │
                │   • Landing                      │
                │   • Pricing                      │
                │   • Blog (Stage 2)               │
                │   • Legal (Imprint, Privacy)     │
                │   • Stripe Checkout redirect     │
                │   • Auth signin/signup pages     │
                └──────────────┬───────────────────┘
                               │
                               │ user signs up / pays / logs in
                               ▼
                ┌──────────────────────────────────┐
                │   app.apex.[domain]              │
                │   ────────────────               │
                │   Product App                    │
                │   Expo SDK 55 (Universal)        │
                │                                  │
                │   ▶ Web (React Native Web)       │
                │   ▶ iOS App (App Store)          │
                │   ▶ Android App (Play Store)     │
                │   ▶ Desktop (Tauri-wrapped Web)  │
                │                                  │
                │   Offline-First with PowerSync   │
                └──────────────┬───────────────────┘
                               │
                               │ all data via PowerSync sync engine
                               ▼
        ┌──────────────────────────────────────────┐
        │          Supabase (EU, Frankfurt)         │
        │   ─────────────────────────────────       │
        │   • Postgres + RLS (source of truth)      │
        │   • Auth (shared by both apps)            │
        │   • Storage (avatars, attachments)        │
        │   • Edge Functions (scheduled jobs)       │
        │                                            │
        │          PowerSync Service (EU)            │
        │   ─────────────────────────────────       │
        │   • Streams Postgres changes to clients   │
        │   • Bucket-based partitioning per workspace│
        │   • Last-write-wins conflict resolution   │
        └──────────────────────────────────────────┘
```

---

## Marketing Site Stack

The marketing site has one job: **convert visitors into paid users.** SEO, conversion, legal compliance, payment redirect.

| Layer                  | Choice                                     | Why                                                                      |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| Framework              | **Next.js 15** App Router                  | Best-in-class SEO, RSC, ISR, fast LCP. Petja's known stack.              |
| Language               | **TypeScript 5 strict**                    | Same standard as Product App.                                            |
| Hosting                | **Vercel EU region** (fra1 Frankfurt)      | Edge runtime, preview URLs, EU data residency.                           |
| Styling                | **Tailwind CSS v3.4**                      | Production-stable. v4 deferred until ecosystem catches up. See ADR 0012. |
| Components             | **Custom + Radix UI primitives**           | A few primitives (Button, Card). Not the full Apex design system.        |
| Forms                  | **React Hook Form + Zod + Server Actions** | Newsletter, contact, waitlist.                                           |
| Internationalization   | **next-intl**                              | EN + DE, ICU MessageFormat                                               |
| Analytics              | **Plausible** (cookie-less, EU-hosted)     | DSGVO-friendly, no consent banner needed                                 |
| CMS for Blog (Stage 2) | **MDX in repo** initially                  | Defer Sanity/Contentful unless volume justifies                          |
| Payments               | **Stripe Checkout redirect**               | Click "Buy" → Stripe-hosted page → success redirect to product app       |
| Email capture          | **Resend Audiences**                       | Transactional + broadcast in one tool                                    |
| Domain                 | TBD (decided end of Stage 1)               | Currently codename `apex`                                                |

**Pages (Stage 1):**

- `/` — Landing
- `/pricing` — Tier comparison
- `/sign-in`, `/sign-up`, `/reset-password` — Auth flows
- `/imprint`, `/privacy`, `/terms` — Legal (DE + EN)

**Pages added in Stage 2:** `/blog`, `/changelog`, `/about`, `/manifesto`.

**Bundle target:** First-load JS < 80KB gzipped on landing. Critical for SEO ranking.

---

## Product App Stack

The product app is where users live. Authenticated, offline-first, multi-platform, premium UX.

### Core Framework

| Layer         | Choice                                                          | Why                                                                                                                              |
| ------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | **Expo SDK 56** (aktuell Juni 2026; bei Projektstart neueste stabile SDK prüfen) | Universal React framework. React Native 0.85, Hermes v1 default. New Architecture mandatory seit SDK 55. Production-grade (Bluesky, Beeper, Coinbase use Expo). |
| Router        | **Expo Router 5**                                               | File-based routing, native + web. Static rendering supported.                                                                    |
| Language      | **TypeScript 5 strict**                                         | Zero `any`.                                                                                                                      |
| Runtime       | **React 19.2**                                                  | Stable, ships with SDK 55.                                                                                                       |
| Web rendering | **React Native Web** + Expo Router static rendering             | Same components render to DOM in browser, SEO-capable when needed.                                                               |
| Architecture  | **New Architecture** (Fabric + TurboModules + JSI + Bridgeless) | Mandatory in SDK 55. ~30% better performance than Legacy.                                                                        |

### Styling System

**Important update from v2:** We use Tailwind v3.4 and NativeWind v4.1 (production-stable), not v4 + v5. See ADR 0012.

| Layer            | Choice                                                     | Why                                                                                                                |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Styling system   | **NativeWind v4.2.x** (stable line)                        | Tailwind for React Native. Same className syntax across web and native. v5 (für Tailwind v4) ist Stand Juni 2026 weiter Pre-Release. |
| Tailwind version | **v3.4**                                                   | Production-stable. v4+v5 combo not yet recommended for production. Migration path open for late Stage 2.           |
| Tokens           | **Design tokens in TypeScript** + theme provider           | Single source: `packages/design-tokens/tokens.ts` generates Tailwind preset (marketing) + theme provider (native). |
| Animations       | **react-native-reanimated 3.16+**                          | GPU-accelerated, 60fps on mobile. Web fallback to CSS transitions.                                                 |
| Icons            | **lucide-react-native**                                    | Same as Marketing Site. Consistent.                                                                                |
| Fonts            | **Inter, Cabinet Grotesk, JetBrains Mono** via `expo-font` | Self-hosted in app bundle for offline.                                                                             |
| Blur effects     | **expo-blur**                                              | Glassmorphism backdrop filters (used sparingly per design system)                                                  |
| Gradients        | **expo-linear-gradient**                                   | Hero card accents, premium feel                                                                                    |
| Haptics          | **expo-haptics**                                           | Tap feedback, success buzz, premium-feel mobile UX                                                                 |

### Component Performance

| Component            | Library                                              | Why                                                                                               |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Lists (long)         | **@shopify/flash-list**                              | 10x performance over `<FlatList>` for 50+ items. Recycles cells.                                  |
| Images               | **expo-image**                                       | AVIF/WebP support, blur hash placeholders, modern caching. **Not** `<Image>` from `react-native`. |
| Local state          | **react-native-mmkv**                                | ms latency vs AsyncStorage's 50ms. Used for theme, settings, ephemeral state.                     |
| Forms                | **React Hook Form + Zod**                            | Type-safe, shared schemas with backend.                                                           |
| Date handling        | **date-fns 4** + **`@formatjs/intl-datetimeformat`** | Locale-aware formatting works everywhere. Tree-shakeable.                                         |
| Audio (Focus sounds) | **expo-audio**                                       | **NEW in SDK 55.** `expo-av` is deprecated.                                                       |
| Video (later)        | **expo-video**                                       | Replaces deprecated `expo-av`.                                                                    |

### Data & State

| Layer             | Choice                                                             | Why                                                                                         |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Local DB          | **SQLite via op-sqlite** (PowerSync-recommended)                   | Battle-tested, fast, native on all platforms.                                               |
| Sync engine       | **PowerSync** (EU region)                                          | Streams Postgres → SQLite. Offline queue. Last-write-wins. See ADR 0008.                    |
| Server data hooks | **PowerSync React hooks** + **TanStack Query** for non-synced data | Synced tables use `usePowerSyncQuery`. One-off API calls (Stripe portal etc.) use TanStack. |
| Client UI state   | **Zustand 5**                                                      | Modal open, sidebar collapsed, command palette query. Not for server data.                  |

### Backend (Shared by Both Apps)

| Layer          | Choice                                          | Why                                                                             |
| -------------- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| Database       | **Supabase Postgres** (Frankfurt)               | Postgres + RLS + managed. Pro tier $25/mo pro **Organisation** (inkl. $10 Compute-Credits); jedes weitere Projekt kostet eigenes Compute (~$10+/mo). |
| Auth           | **Supabase Auth**                               | Email/password, OAuth (Google, Apple, GitHub), magic links, email verification. |
| File Storage   | **Supabase Storage** (Frankfurt bucket)         | Avatars, attachments.                                                           |
| Realtime       | **Replaced by PowerSync**                       | PowerSync provides better sync semantics + offline queueing.                    |
| Edge functions | **Supabase Edge Functions** (Deno)              | Scheduled jobs, Stripe webhook handlers, AI Coach API calls.                    |
| Multi-tenancy  | **RLS policies on all workspace-scoped tables** | Enforced at database level. PowerSync sync rules respect RLS.                   |

### Native Wrappers

| Distribution                         | How                                             | Stage                          |
| ------------------------------------ | ----------------------------------------------- | ------------------------------ |
| Web (browser at `app.apex.[domain]`) | Expo Web export, hosted on Vercel               | Stage 1                        |
| PWA (installable)                    | Expo Web + manifest + service worker            | Stage 1 (free, ships with web) |
| iOS App                              | EAS Build + EAS Submit, App Store distribution  | Stage 2                        |
| Android App                          | EAS Build + EAS Submit, Play Store distribution | Stage 2                        |
| Desktop (Win/Mac/Linux)              | Tauri 2.x wrapping the Expo Web export          | Stage 2                        |

### Notifications

| Platform             | Tech                                     | Notes                              |
| -------------------- | ---------------------------------------- | ---------------------------------- |
| Mobile (iOS+Android) | `expo-notifications` + Expo Push Service | Works on both with one API.        |
| Web                  | Web Push API + Service Worker            | iOS Safari PWA support since 16.4. |
| Desktop              | Tauri Notification Plugin                | Native OS notifications.           |

### Build & Deploy

| Tool            | Use                                                 |
| --------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| Package manager | **pnpm 9+**                                         | Fast, monorepo-ready.                                                   |
| Monorepo        | **Turborepo**                                       | `apps/marketing` + `apps/product` + `packages/*` for shared code.       |
| Local dev       | `pnpm dev` runs both apps + Supabase local          | One command, full stack.                                                |
| EAS Build       | Mobile + Production builds                          | Free tier sufficient for Stage 1. **Starter $19/mo** ab Stage 2; der "Production"-Plan kostet $199/mo (erst bei >3k MAU für EAS Update relevant). |
| EAS Submit      | Auto-submission to App Store + Play Store           | Skips manual upload steps.                                              |
| EAS Update      | OTA updates (now with bundle diffing — 75% smaller) | Free tier sufficient ≤ 1k MAU.                                          |
| GitHub Actions  | CI/CD (typecheck, lint, test, deploy preview)       | Free for solo.                                                          |
| Vercel          | Marketing + Product Web deployment                  | Both apps deploy to Vercel.                                             |
| Sentry          | Error tracking                                      | Sentry SDK works on web + iOS + Android + desktop.                      |

---

## Repository Structure

```
apex-os/
├── CLAUDE.md
├── README.md
├── SETUP.md
├── package.json                  # workspace root, pnpm + turbo
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
├── .gitignore
│
├── apps/
│   ├── marketing/                # Next.js 15
│   │   ├── app/
│   │   │   ├── (marketing)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── pricing/page.tsx
│   │   │   │   └── ...
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/page.tsx
│   │   │   │   └── ...
│   │   │   └── (legal)/
│   │   │       ├── imprint/page.tsx
│   │   │       └── privacy/page.tsx
│   │   ├── components/
│   │   ├── messages/
│   │   ├── public/
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── product/                  # Expo SDK 55
│       ├── app/                  # Expo Router file-based
│       │   ├── _layout.tsx
│       │   ├── (auth)/
│       │   ├── (app)/
│       │   │   ├── _layout.tsx
│       │   │   ├── dashboard/
│       │   │   ├── tasks/
│       │   │   ├── habits/
│       │   │   ├── focus/
│       │   │   └── ...
│       │   └── +not-found.tsx
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       │   ├── powersync/
│       │   ├── supabase/
│       │   └── utils/
│       ├── stores/               # Zustand
│       ├── styles/
│       ├── messages/
│       ├── assets/
│       │   ├── fonts/
│       │   ├── audio/
│       │   └── icons/
│       ├── ios/                  # generated by EAS prebuild
│       ├── android/              # generated by EAS prebuild
│       ├── tauri/                # Stage 2
│       ├── app.json              # Expo config
│       ├── eas.json              # EAS Build config
│       ├── babel.config.js
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared NativeWind components
│   ├── design-tokens/            # Single source of truth
│   ├── types/                    # Shared TS types + DB types
│   ├── i18n/                     # en.json + de.json
│   └── lib/                      # xp-engine, validation, etc.
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── powersync/
│   ├── schema.ts
│   └── sync-rules.yaml
│
├── docs/
│   ├── product-vision.md
│   ├── architecture.md           # this file
│   ├── data-model.md
│   ├── design-system.md          # core principles
│   ├── design-system/
│   │   └── components/           # 21 detailed component specs
│   │       ├── README.md
│   │       ├── button.md
│   │       ├── input.md
│   │       └── ...
│   ├── decisions/                # ADRs
│   └── phases/                   # Phase prompts
│
└── tests/
    ├── e2e/                      # Playwright (web) + Maestro (mobile)
    └── shared/
```

---

## Performance Budget

Enforced. Phases violating must fix before merge.

### Marketing Site

| Metric          | Target         | Tool         |
| --------------- | -------------- | ------------ |
| LCP (4G)        | < 1.5s         | Lighthouse   |
| INP             | < 100ms        | Web Vitals   |
| CLS             | < 0.05         | Lighthouse   |
| First-load JS   | < 80KB gzipped | `next build` |
| Lighthouse perf | ≥ 95           | CI gate      |

### Product App (Web)

| Metric              | Target          | Tool                                             |
| ------------------- | --------------- | ------------------------------------------------ |
| LCP (4G, dashboard) | < 2.0s          | Lighthouse                                       |
| INP                 | < 100ms         | Web Vitals                                       |
| First-load JS       | < 350KB gzipped | Acceptable for app, less critical than marketing |
| TTI (3G)            | < 4.5s          | Lighthouse mobile                                |

### Product App (Mobile Native)

| Metric             | Target                        | Tool                |
| ------------------ | ----------------------------- | ------------------- |
| Cold start         | < 1.5s on iPhone 12 / Pixel 6 | Expo dev tools      |
| Tap response       | < 50ms                        | Reanimated profiler |
| List scroll FPS    | ≥ 58fps                       | Native profiler     |
| App size (iOS)     | < 50MB                        | App Store Connect   |
| App size (Android) | < 30MB                        | Play Console        |

### Animation Budget

GPU only. `transform` and `opacity` only.
Mobile: `react-native-reanimated` for 60fps even during JS-thread work.
Web: CSS transitions for hover; Framer Motion only when justified.

### Database

| Metric                           | Target  |
| -------------------------------- | ------- |
| API response p95                 | < 300ms |
| DB query p95                     | < 50ms  |
| PowerSync initial sync (1k rows) | < 2s    |
| PowerSync incremental sync       | < 200ms |

---

## Cost Projection (Monthly)

For transparency. Verify all numbers before commitments.

### Stage 1 (Alpha — solo founder, ~50 users)

| Service           | Cost       | Note                                                 |
| ----------------- | ---------- | ---------------------------------------------------- |
| Supabase Free     | $0         | Pauses after 1 week inactivity (acceptable in Alpha) |
| PowerSync Free    | $0         | Limited MAU                                          |
| Vercel Hobby      | $0         | Within free limits                                   |
| Resend Free       | $0         | 100 emails/day                                       |
| Sentry Free       | $0         | 5k errors/month                                      |
| PostHog Free      | $0         | 1M events/month                                      |
| Plausible         | €9/mo      | Cheaper than alternatives, EU-hosted                 |
| **Total Stage 1** | **~€9/mo** | Negligible                                           |

### Stage 2 (Beta — ~100 paying users)

| Service                | Cost                  | Note                                                 |
| ---------------------- | --------------------- | ---------------------------------------------------- |
| Supabase Pro (1 Org)   | $25/mo + ~$10 Compute | Pro pro Organisation; 2. Projekt (Dev) zahlt Compute  |
| Supabase Custom Domain | $10/mo                | For `db.apex.[domain]`                               |
| PowerSync Pro          | $49/mo                | 30GB synced, 10GB hosted, 1k Connections (Stand 2026) |
| Vercel Pro             | $20/mo                | Custom domains, bandwidth                            |
| Resend Pro             | $20/mo                | Domain verified, more emails                         |
| Sentry Team            | $26/mo                | More errors, better tracing                          |
| PostHog Pro            | $0-50/mo              | Depends on event volume                              |
| Plausible              | €9/mo                 |                                                      |
| EAS Starter            | $19/mo                | Mobile builds ($45 Build-Credits, 3k MAU Updates)    |
| Apple Developer        | $99/year (~€8/mo)     | iOS App Store                                        |
| Google Play            | $25 one-time          | Android Play Store                                   |
| Stripe fees            | ~1.5% per transaction | EU rates                                             |
| **Total Stage 2**      | **~€220-270/mo**      | At 100 paying users (€1,200/mo MRR) → margin healthy |

### Stage 3 (Launch+ — ~1,000 paying users, AI Coach live)

| Service                    | Cost              | Note                                            |
| -------------------------- | ----------------- | ----------------------------------------------- |
| Supabase Pro + add-ons     | ~$60-80/mo        | Higher compute                                  |
| PowerSync Pro + Usage      | $49/mo + Usage    | $1/GB synced über 30GB, $30/1k Connections      |
| Vercel Pro                 | $20/mo            |                                                 |
| Resend Pro                 | $35/mo            | More emails, broadcast                          |
| Sentry Team                | $26/mo            |                                                 |
| PostHog Pro                | ~$100/mo          | More events                                     |
| Plausible                  | €19/mo            | More pageviews                                  |
| EAS Starter→Production     | $19-199/mo        | Production-Plan ($199) erst nötig bei >3k MAU   |
| Apple + Google             | ~€8/mo            |                                                 |
| Anthropic API (AI Coach)   | ~€450-900/mo      | At 1k users with limits                         |
| Stripe fees                | ~1.5%             |                                                 |
| **Total Stage 3**          | **~€900-1500/mo** | At 1k paying users (€12k/mo MRR) → margin solid |

---

## Security & DSGVO Compliance

DSGVO is **mandatory** because Petja operates in Germany. See `docs/decisions/0010-dsgvo-compliance.md` for full checklist.

### Required Before Public Launch (Stage 2)

> ⚠️ **Status: OFFEN.** Diese Checkliste war fälschlich komplett abgehakt, obwohl das Projekt
> noch nicht gestartet ist. Erst abhaken, wenn der jeweilige Vertrag/Code wirklich existiert.

- [ ] AVV signed with Supabase (EU region)
- [ ] AVV signed with Vercel
- [ ] AVV signed with PowerSync (EU region)
- [ ] AVV signed with Stripe
- [ ] AVV signed with Resend
- [ ] AVV signed with Sentry (EU region)
- [ ] AVV signed with PostHog (EU region)
- [ ] DPA accepted with Anthropic (self-serve, in Commercial Terms enthalten) + SCC/DPIA dokumentiert
- [ ] Datenschutzerklärung (DE) drafted by lawyer or e-recht24 generator
- [ ] Privacy Policy (EN) translated and reviewed
- [ ] Imprint page (TMG-compliant) — Stage 1
- [ ] AGB (DE) + Terms of Service (EN)
- [ ] Cookie banner only if cookies set (Plausible doesn't set any; PostHog-Konfiguration prüfen → TTDSG §25)
- [ ] Account deletion = hard delete (CASCADE) implemented
- [ ] Data export = JSON download per workspace implemented
- [ ] Email verification required before payment (in Phase 08 lokal deaktiviert — vor Launch reaktivieren, siehe ADR 0013!)
- [ ] 2FA available, optional for users, required for admin

### Hosting & Data Residency

| Service        | Region                              | DSGVO                                |
| -------------- | ----------------------------------- | ------------------------------------ |
| Supabase       | Frankfurt                           | ✓ EU, AVV available                  |
| Vercel         | Frankfurt (fra1)                    | ✓ EU, AVV available                  |
| PowerSync      | EU (Ireland)                        | ✓ EU, AVV available                  |
| Resend         | EU-**Sende**region (eu-west-1)      | ⚠ Versand EU, Account-Daten/Logs US (DPA+SCC) |
| Stripe         | Stripe Payments Europe Ltd, Ireland | ✓ EU, AVV available                  |
| Plausible      | Germany                             | ✓ Cookieless                         |
| PostHog        | EU region                           | ✓ AVV available                      |
| Sentry         | EU region                           | ✓ AVV available                      |
| Cloudflare DNS | DE relevant                         | ✓ for DNS only, no PII               |
| EAS (Expo)     | US-based                            | ⚠ Build artifacts only, no user data |
| Anthropic API  | Keine EU-Residenz für Direct API (Stand 06/2026: inference nur us/global) | ⚠ DPA self-serve ✓; SCC + DPIA nötig, alternativ Bedrock/Vertex EU. Vor Phase 24 klären. |

**EAS exception:** Expo's EAS Build service runs in US for compiling app binaries. No user data passes through it. Acceptable under DSGVO as no personal data is processed there.

**Anthropic exception:** Stand Juni 2026 bietet die direkte Claude API **keine** EU-Datenresidenz (Workspace-Storage nur US; Inference us/global). Der DPA inkl. SCCs ist self-serve in den Commercial Terms enthalten. **Vor Phase 24 (AI Coach):** SCC-Basis + DPIA dokumentieren ODER auf AWS Bedrock / Google Vertex mit EU-Region ausweichen. AI-Coach-Daten minimieren (nur nötigen Kontext senden, keine Klarnamen).

---

## Forbidden Choices

- **No native iOS/Android codebases separate from Expo.** Single source of truth.
- **No Tailwind v4 + NativeWind v5 in production.** Pre-release, not stable. v3.4 + v4.1 only. See ADR 0012.
- **No Supabase Realtime in product app.** PowerSync replaces it.
- **No client-side direct Postgres queries.** All sync via PowerSync, special cases via Supabase RPC.
- **No Redux, MobX, Recoil, Jotai.** Zustand for UI state, PowerSync hooks for synced data.
- **No GraphQL.** REST + Postgres-direct via PowerSync.
- **No tRPC.** Server logic in Edge Functions or PowerSync sync rules.
- **No real-time collaborative editing in Stage 1-2.** PowerSync's last-write-wins is sufficient.
- **No hand-rolled auth.** Supabase Auth, period.
- **No NoSQL.** Postgres handles all use cases.
- **No `expo-av`.** Deprecated as of SDK 53. Use `expo-audio` and `expo-video`.
- **No `<FlatList>` for lists with 50+ items.** Use `@shopify/flash-list`.
- **No `<Image>` from `react-native`.** Use `expo-image` with blur hash placeholders.
- **No AsyncStorage for hot-path state.** Use `react-native-mmkv` (ms latency).

---

## What Changed in v3 (Audit Findings)

This document was updated based on a tech-stack audit. Key changes:

### Corrections

1. **Expo SDK 52 → 55** — SDK 55 is current (Feb 2026). React Native 0.83. New Architecture mandatory. SDK 52 details obsolete.
2. **expo-av → expo-audio** — `expo-av` deprecated since SDK 53. We use `expo-audio` for Focus session sounds.
3. **Tailwind v4 + NativeWind v5 → Tailwind v3.4 + NativeWind v4.1** — v5 is pre-release, not production-ready. Migration path open. See ADR 0012.
4. **Supabase Pro pricing clarified** — $25/mo PER PROJECT. Dev + Prod = $50/mo + $10 custom domain.
5. **Supabase Free pause** — Free projects pause after 1 week inactivity. Acceptable for Alpha; upgrade to Pro for live products.

### Additions

6. **expo-image** for all images (AVIF, WebP, blur hashes)
7. **expo-haptics** for premium tap feedback
8. **expo-blur** for glassmorphism (sparingly)
9. **expo-linear-gradient** for premium hero accents
10. **@shopify/flash-list** for performant long lists
11. **react-native-mmkv** for fast local state
12. **Cost projection table