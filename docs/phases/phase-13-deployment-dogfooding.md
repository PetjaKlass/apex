# Phase 13 — Stage 1 Polish + Deployment + Dogfooding

> **Stage:** Alpha (final phase of Stage 1)
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 12 complete

## Goal

Deploy Apex Alpha to production environment, fix critical bugs from real usage, begin dogfooding period. By end of phase: Apex is live, Petja uses it daily.

## Why Now

Stage 1 success requires real usage. You can't test productivity software with mocks. Petja must use Apex daily for 30+ days to validate before investing in mobile + marketing (Stage 2).

## Prerequisites

- Phases 01-12 complete
- Dashboard, Tasks placeholder, Habits placeholder, OBT all working locally
- Vercel account exists
- Domain decided OR using Vercel subdomain temporarily

## Scope

1. Production Vercel deployment (Marketing + Product Web)
2. Production Supabase project (separate from Dev)
3. Production PowerSync instance
4. Sentry production environment configured
5. PostHog production tracking
6. Smoke tests on production
7. PWA configuration (manifest, service worker, install prompt)
8. Petja installs PWA on phone + laptop + desktop
9. Bug log started
10. Daily dogfooding begins
11. End-of-Stage-1 retrospective (~14 days into dogfooding)

## Out of Scope

- Mobile native apps (Phase 21)
- Marketing public launch (Phase 23)
- Stripe payments (Phase 22)
- Custom domain (use Vercel subdomain if domain not ready)
- Polished marketing copy (Phase 23)

## Acceptance Criteria

### Deployment

- [ ] Marketing Site deployed to Vercel (Frankfurt fra1 region)
- [ ] Product Web App deployed to Vercel
- [ ] Production Supabase project (Frankfurt) created and migrated
- [ ] Production PowerSync (EU Ireland) connected
- [ ] All env vars set in Vercel (no `.env.local` referenced in production)
- [ ] HTTPS works on both apps
- [ ] DNS configured (or Vercel subdomain if domain pending)

### Monitoring

- [ ] Sentry production environment receives errors
- [ ] PostHog production tracks events
- [ ] Plausible tracking on Marketing Site

### PWA

- [ ] `manifest.json` configured (name, icons, theme color)
- [ ] Service worker registered (offline support)
- [ ] App icons (multiple sizes, including iOS apple-touch-icon)
- [ ] "Add to Home Screen" works on iOS Safari + Android Chrome
- [ ] PWA installs correctly on macOS + Windows desktop browsers

### Smoke tests

- [ ] Sign up new user on production → email arrives → verify → product app loads
- [ ] Create task on web → see in PWA on phone within 200ms
- [ ] Logout works
- [ ] Lighthouse scores still ≥ 90 on production

### Dogfooding

- [ ] Petja installs PWA on:
  - [ ] Laptop (work device)
  - [ ] Desktop PC (home device)
  - [ ] iPhone or Android phone
- [ ] Petja signs up + completes onboarding on production
- [ ] Bug log file created: `docs/dogfooding-log.md`
- [ ] Daily check-in routine established
- [ ] First 7 days: track issues, friction, ideas

### Retrospective (Day 14)

- [ ] What works well?
- [ ] What's painful?
- [ ] What's missing critically (vs nice-to-have)?
- [ ] Decision: ready for Stage 2 or need more Stage 1 work?

## Implementation Plan

1. **Production Supabase** (~2 hours) — new project, run migrations, configure auth emails
2. **Production PowerSync** (~1 hour) — EU instance, connect to production Supabase
3. **Vercel Marketing deploy** (~2 hours) — connect repo, env vars, region, deploy
4. **Vercel Product deploy** (~2 hours) — same process
5. **Sentry setup** (~1 hour) — production DSN, source maps, release tracking
6. **PostHog setup** (~30 min) — production project, key events instrumented
7. **PWA manifest + service worker** (~3 hours) — manifest, icons, sw config
8. **DNS / Vercel subdomain** (~1 hour) — point domain or use vercel.app for now
9. **Smoke tests** (~2 hours) — full E2E on production
10. **Bug fixes from smoke** (~variable) — fix issues found
11. **Dogfooding kickoff** (Petja, ongoing 30 days) — daily use
12. **Day 14 retrospective** (Petja, ~2 hours)
13. **Commit + tag** (~30 min) — git tag `v0.1.0-alpha`

## Files Created/Modified

**Created:**

- `apps/product/public/manifest.json`
- `apps/product/public/icons/` (multiple sizes)
- `apps/product/public/service-worker.js`
- `apps/marketing/public/manifest.json` (basic PWA for marketing too)
- `docs/dogfooding-log.md` (template for Petja's daily notes)
- `docs/stage-1-retrospective.md` (created at day 14)

**Modified:**

- `vercel.json` for both apps
- `apps/product/app/_layout.tsx` (manifest link)
- Various env vars in Vercel dashboard

## Common Pitfalls

**1. Env var leaks** — `.env.local` not deployed (correct), but env vars must be set in Vercel dashboard. Easy to forget some.

**2. Supabase production cost** — Free tier pauses after 7 days inactivity. Petja using daily prevents this. If pause occurs: Pro tier $25/mo (Phase 22 budget).

**3. Service worker caching** — too aggressive caching can serve stale code. Test thoroughly.

**4. iOS PWA limitations** — push notifications require iOS 16.4+. Background sync limited. Document for awareness.

**5. Bug log discipline** — easy to skip "I'll remember this." Note every bug, however small.

**6. Premature Stage 2 jump** — if Stage 1 has obvious gaps, fix them before mobile. Mobile multiplies bugs 3x.

**7. PWA install prompt** — browsers control timing. Don't fight it. Apple doesn't show prompt at all.

## Done When (End of Stage 1!)

- Production deployment stable for 7 days
- Petja uses Apex daily (PWA on phone + desktop)
- Day 14 retrospective complete
- All P0 bugs from real usage fixed
- Bug log has clear pattern of issues (informs Stage 2 phases)
- Stage 1 acceptance criteria met (per Roadmap)
- Petja explicitly says "I trust this enough to invest in Stage 2"
- Commit + tag: `git tag v0.1.0-alpha && git push --tags`

🎉 **End of Stage 1. Apex Alpha is alive.**

Take a 2-3 day break before Stage 2. Reset.

---

**Next:** `phase-14-tasks.md` (Stage 2 begins!)
