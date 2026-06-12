# ADR 0003 — Native Distribution Across Stages

**Status:** Accepted (replaces v1)
**Date:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

With the architecture switching to Expo Universal (ADR 0001 v2), the cost of shipping to iOS App Store and Google Play Store dropped dramatically. EAS Build handles signing, packaging, and submission. We must decide which distributions ship at which stage.

## Decision

| Distribution            | Tech                            | Stage       | Trigger                                           |
| ----------------------- | ------------------------------- | ----------- | ------------------------------------------------- |
| Web (browser)           | Expo Web export                 | Stage 1     | Day 1                                             |
| PWA (installable)       | Expo Web + manifest + SW        | Stage 1     | Free, ships with web                              |
| iOS App Store           | EAS Build → Expo native iOS     | **Stage 2** | After Stripe billing exists, before public launch |
| Android Play Store      | EAS Build → Expo native Android | **Stage 2** | Same as iOS                                       |
| Desktop (Win/Mac/Linux) | Tauri 2.x wrapping Expo Web     | **Stage 2** | After mobile, before public launch                |

**Change from v1:** Mobile App Stores moved from Stage 3 to Stage 2. Justification: Expo makes the cost of shipping mobile native a few days of work, not weeks. Solo-founder economics now favor "ship to all stores at launch" rather than "web-only launch, mobile later."

## Stage 1: Web + PWA (Codename Alpha)

**Goal:** Founder uses Apex daily for 30 days. Validate the core loops.

**Distributions:**

- Web at `app.apex.localdev` (local dev) → preview deploys at Vercel
- PWA installable on any browser

**Why no native yet:** Save the Apple Developer Account fee ($99/year) until ready for paid testing. Save EAS Build setup until needed. Iterate fast on web, where deploys are instant.

**Limitations accepted:**

- iOS PWA requires user to "Add to Home Screen" manually
- No push notifications until Stage 2
- No App Store discovery yet (irrelevant — no public launch yet)

## Stage 2: All Distributions Ship Together (Codename Beta)

**Goal:** 100 paying users. Public launch on ProductHunt + X.

**New distributions added:**

- iOS App Store (EAS Build + EAS Submit)
- Android Play Store (EAS Build + EAS Submit)
- Desktop apps (Tauri-wrapped Expo Web)

**Why all at once:** A coordinated launch with apps in stores creates much higher launch impact than "web only" then "mobile coming soon." Solo founders who launched on ProductHunt with all distributions simultaneously consistently report 2-3x higher sign-ups vs web-only launches.

**Setup required (one-time):**

- Apple Developer Account: $99/year
- Google Play Console: $25 one-time
- EAS Production tier: $19/month (or stay on free tier with limited builds/month)
- Code signing certificates: handled by EAS automatically
- Privacy Policy URL (App Store + Play Store require this) — already required for DSGVO

**Build pipeline (GitHub Actions):**

- On `main` branch push: build Expo Web, deploy to Vercel
- On version tag push: trigger EAS Build for iOS + Android
- Beta testers via TestFlight (iOS) + Play Internal Testing (Android)
- After QA: EAS Submit to App Store + Play Store

**Tauri Desktop:**

- Builds for macOS (universal binary), Windows (MSI), Linux (AppImage + DEB)
- macOS code-signed via Apple Developer Account (already obtained)
- Windows: unsigned for Stage 2 (acceptable; users see "publisher unknown" warning). Stage 3 budget allows EV cert (~€350/year)
- Linux: unsigned (community standard)
- Auto-updater via Tauri's built-in updater pointing to GitHub Releases
- Distribution: download buttons on marketing site (no external store)

## Stage 3: Optimization & Scale (Codename Launch+)

**Goal:** 1,000 paying users. Sustainable growth.

**No new distributions added in Stage 3.** Stage 3 focuses on:

- Performance optimization based on Stage 2 user data
- Feature additions based on PMF feedback
- AI Coach (Anthropic API) addition
- Possibly: browser extension if user demand justifies
- Possibly: API for integrations (Zapier, Make) if user demand justifies

**Mobile / desktop optimizations:**

- Address App Store rejection feedback if any
- Native widgets (iOS WidgetKit, Android App Widgets) — requires native modules, evaluated case-by-case
- Apple Watch companion — likely never (productivity-glance widgets sufficient)
- Spotlight Search (iOS), Quick Actions (Android) — Stage 3 nice-to-have

## Subscription & In-App Purchase Strategy

Critical decision because of App Store policies:

**Apex sells via Stripe on the web only.** Apple/Google in-app purchases are NOT used.

**Compliance with App Store Review Guideline 3.1.3(a):**

- App is "reader" type per the guideline (sells access to content/services managed externally)
- Mobile apps allow login but show upgrade prompts that say "Manage subscription on apex.[domain]" — never directly link to Stripe
- This complies with the rules used by Spotify, Netflix, Bumble, etc.

**Why not Apple/Google IAP:**

- 30% fee (or 15% for small developer program)
- No EU VAT handling (we'd need to handle ourselves vs. Stripe handling it)
- Cross-platform subscription state harder to manage
- Standard "reader app" pattern works fine and saves 15-30%

**EU-specific change (DMA 2024+):** Apple now permits external links to web purchase in EU — but the safe path remains "don't link, just mention." We'll evaluate using EU external linking permissions in Stage 3 if it materially improves conversion.

## Cost Summary by Stage

| Stage   | Apple Dev | Google Play | EAS Build | Stripe            | Total / year             |
| ------- | --------- | ----------- | --------- | ----------------- | ------------------------ |
| Stage 1 | —         | —           | Free tier | —                 | ~€0                      |
| Stage 2 | $99       | $25 (once)  | $19/mo    | 1.5% per txn (EU) | ~$350/year + Stripe fees |
| Stage 3 | $99       | $0          | $19-99/mo | 1.5% per txn (EU) | ~$1,500/year             |

Predictable, sustainable for solo SaaS economics.

## Trade-Offs

### Positive

- All distributions ship together at public launch (higher PR impact)
- One codebase keeps maintenance burden manageable
- App Store presence helps user discovery and trust
- OTA updates via EAS Update reduce App Store review friction

### Negative

- Apple Developer fee + minimum EAS investment ~$350/year before any users
- App Store review can delay launches (1-7 days unpredictable)
- iOS subscription UX is slightly degraded by external-payment requirement

### Mitigations

- Apple/Google fees recovered after first 30 paid users (well below revenue ceiling)
- App Store review delays planned into Stage 2 timeline (2-week buffer pre-launch)
- External payment UX clearly communicated, users understand "subscribe on website"

## Out of Scope

These are NOT addressed by this ADR:

- **React Native New Architecture migration** — Expo SDK 52 already supports it, opt-in per phase
- **Apple Watch app** — likely never
- **Apple Vision Pro / Meta Quest** — explicitly never
- **Smart speaker integration** — explicitly never
- **Browser extension** — Stage 3 evaluation only
- **Public API for users** — Stage 3 only if Zapier/Make integration demand justifies

## What Triggers Revisiting

- If EAS Build economics change unfavorably
- If App Store / Play Store policies change to disallow our subscription model
- If desktop adoption is so low that Tauri investment isn't justified (track usage in Stage 2)
