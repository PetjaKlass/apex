# ADR 0001 — Expo Universal, not Next.js for the Product App

**Status:** Accepted (replaces v1 of this ADR)
**Date:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

The original (v1) decision was "Web-First Next.js with Tauri/Capacitor wrappers later." This decision was revisited when the founder explicitly required:

1. Browser distribution (web SaaS)
2. Desktop distribution (Win/Mac/Linux)
3. Native mobile distribution (iOS App Store + Android Play Store)
4. **Offline-first with sync on reconnect**
5. Real-time sync between user's devices

Constraint #4 (true offline-first) is fundamentally incompatible with Next.js's server-driven architecture. Next.js 15's value (Server Components, Server Actions, Streaming SSR) all assume server reachability. Building offline-first on top of Next.js means actively bypassing the framework's main features.

## Decision

**The product app is built with Expo SDK 52 (React Native + React Native Web).**

Marketing site remains Next.js 15 as a separate app in the same monorepo. See ADR 0009 for rationale on splitting.

## Why Expo

### One Codebase, Four Client Outputs

| Distribution       | How Expo handles it                                                     |
| ------------------ | ----------------------------------------------------------------------- |
| Web (browser)      | `expo export --platform web` produces static SPA hosted on Vercel       |
| PWA                | Expo Web + manifest.json + service worker = installable on all browsers |
| iOS App Store      | EAS Build → IPA → App Store Connect submission                          |
| Android Play Store | EAS Build → AAB → Play Console submission                               |
| Desktop            | Tauri wraps the Expo Web build                                          |

Bluesky, Beeper, Coinbase, Tinder, Discord, Shopify Inbox all run on this stack in production.

### Offline-First as Default Architecture

React Native apps run all data logic client-side by default. Adding SQLite for local storage and a sync engine (PowerSync) gives true offline-first without fighting the framework.

In Next.js, achieving the same would require:

- Bypassing Server Components (the main feature of Next.js 15)
- Custom Service Worker for asset caching
- Custom IndexedDB layer for data caching
- Custom write queue for offline mutations
- Custom conflict resolution
- Effectively rebuilding what PowerSync gives for free

### Native Mobile Performance

Expo apps render via native UIKit (iOS) and native View hierarchy (Android) — not webview. List scrolling, animations, gestures all use native code paths. This matters because mobile users abandon apps that feel "web-like."

Capacitor (the Next.js mobile path) renders inside a webview, ceiling-locked to browser performance. App Store reviewers have rejected Capacitor apps for being "web wrappers" since 2024.

### Distribution Cost

| Distribution            | Tauri+Capacitor (v1 plan) | Expo (v2 plan)      |
| ----------------------- | ------------------------- | ------------------- |
| Time to first iOS build | Phase 30 (Stage 3)        | Phase 5 (Stage 1)   |
| Apple Developer Account | Required Stage 3          | Required Stage 1-2  |
| Code signing complexity | Manual setup              | Handled by EAS      |
| OTA updates             | Not possible              | EAS Update built-in |
| App Store review prep   | Manual                    | EAS Submit          |

Native apps move from "Stage 3 if we get there" to "shipped during Stage 2" because Expo makes it cheap.

### Solo-Founder Track Record

Solo and small-team SaaS products that ship to all platforms successfully use Expo Universal:

- **Bluesky** (now 25M+ users, started small): full Expo
- **Beeper** (universal messaging, started solo): full Expo
- **Pillar Wallet, Coinbase Wallet**: Expo
- **Discord, Tinder, Shopify Inbox**: React Native (what Expo wraps)

The pattern is established. The risk is known. The tooling is mature.

## Why Marketing Stays Next.js

The marketing site has fundamentally different requirements than the product app:

| Aspect                 | Marketing Site                 | Product App                      |
| ---------------------- | ------------------------------ | -------------------------------- |
| Audience               | Anonymous visitors             | Authenticated users              |
| Core need              | SEO, conversion, trust signals | Offline-first, fast interactions |
| Update frequency       | Rarely (post-launch)           | Daily (during dev)               |
| Distribution           | Web only                       | Web + iOS + Android + Desktop    |
| Bundle size constraint | Critical (< 80KB)              | Acceptable (< 350KB)             |

Forcing both into one stack means compromising both. Splitting them is the right call. See ADR 0009 for full reasoning.

## Trade-Offs Accepted

### Web SEO is weaker for the Product App

React Native Web does not produce SSR-friendly markup like Next.js. Search engines see less structured content. **Acceptable** because the product app is gated behind authentication — SEO doesn't matter for `app.apex.[domain]/dashboard`.

### Bundle is larger on web

Expo Web app: ~350KB first load. Next.js equivalent: ~200KB. **Acceptable** because users authenticate once and the bundle caches. No SEO or first-impression cost.

### Some npm libraries don't work

Anything that uses DOM APIs directly (e.g., `react-pdf` web-only versions) won't run on native. **Mitigation:** check library compatibility before adopting; React Native ecosystem has equivalents for everything we need.

### Founder learning curve

Petja knows Next.js well, not Expo. Expected ramp: 2-3 days of tutorials, 1-2 weeks slower for Phases 1-3, then equal or faster.

**Mitigation:** structured Expo tutorial completion before Phase 1 Day 1. Then build alongside Claude Code which knows Expo patterns deeply.

## Trade-Offs Rejected (Why Not Alternatives)

### Why not Tauri Mobile?

Tauri Mobile (iOS/Android beta since 2024) is not production-ready as of 2026. App Store compliance unproven. Risk too high for revenue-critical product.

### Why not separate React Native + Next.js?

Two codebases for the same product = solo-founder killer. Every feature implemented twice. Synchronizing design, state, types becomes a job in itself.

### Why not Flutter?

Dart language unfamiliar. Different ecosystem. Cross-platform but not as web-native as Expo. Excellent technology, wrong for this team.

### Why not native iOS Swift + native Android Kotlin + Next.js Web?

Three codebases. Solo-founder suicide.

### Why not pure PWA-only (no native apps)?

iOS PWA limitations: no background sync until iOS 16.4+, no push without home-screen install, App Store users prefer native apps for trust. Capping at PWA-only would cap revenue at 60-70% of TAM.

## Implementation Notes

### What this changes from v1

- **architecture.md** — Stack section rewritten
- **data-model.md** — Same schema, plus PowerSync sync rules and bucket definitions
- **design-system.md** — Tokens transition from CSS Custom Properties only to TS-exported tokens that generate Tailwind preset (web) and theme provider (native)
- **Phase plan** — Some phases merge or shift; no fundamental restructuring

### What stays the same

- Supabase as backend
- Postgres + RLS for multi-tenancy
- Workspace-centric data model
- Two personas (Solo + Duo)
- DSGVO + EU hosting requirement
- Three-stage release plan (Alpha → Beta → Launch)

### Founder onboarding

Before Phase 1 Day 1, Petja completes:

- [Expo official tutorial](https://docs.expo.dev/tutorial/introduction/) (~2 hours)
- [Expo Router documentation overview](https://docs.expo.dev/router/introduction/) (~1 hour)
- [NativeWind setup guide](https://www.nativewind.dev/getting-started/expo-router) (~30 min)
- One throwaway "hello world" Expo app to verify local toolchain (~30 min)

Total ~4 hours upfront. Saves weeks of refactoring later.

## What Triggers Revisiting

This decision should be revisited if:

- Expo SDK has a breaking architectural change that doesn't suit Apex (none expected)
- PowerSync becomes financially unviable (unlikely; pricing predictable)
- A specific feature requires native-only code that Expo cannot expose (none anticipated)

## What Does NOT Trigger Revisiting

- Founder's nostalgia for Next.js patterns
- Marketing voices saying "X said React Native is bad"
- Bundle size complaints on web (expected, accepted)

## References

- [Expo SDK 52 release notes](https://expo.dev/changelog/sdk-52)
- [PowerSync overview](https://www.powersync.com/)
- [Bluesky open-source app (Expo Universal)](https://github.com/bluesky-social/social-app)
- [App Store Review Guideline 4.7 (web wrappers)](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality)
