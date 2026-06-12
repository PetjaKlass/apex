# ADR 0013 — Local Dev: Cross-Port Cookie Sharing Not Possible

**Status:** Accepted
**Date:** 2026-06-05
**Deciders:** Petja Klass (founder), Claude (advisor)
**Supersedes:** ADR 0009 (section "Local dev: simulated via different localhost ports")

## Context

ADR 0009 describes the Marketing→Product session handoff as:

> "Cookie sharing: Setting Supabase session cookie at `.apex.[domain]` (note leading dot) shares it across `apex.[domain]` and `app.apex.[domain]`."
> "For Stage 1 (when running locally), simulated via different localhost ports."

During Phase 08 implementation it became clear that this assumption is incorrect. Browsers enforce strict origin isolation: `localhost:3000` and `localhost:8081` are **different origins**. Cookies set by `localhost:3000` are not readable by `localhost:8081`, regardless of any domain configuration. The leading-dot trick works for subdomains in production (`.apex.com` covers both `apex.com` and `app.apex.com`), but there is no equivalent for port-differentiated localhost origins.

## Decision

1. **The Marketing→Product handoff will only be tested end-to-end in Phase 13 (Deployment)**, where both apps run on their production subdomains (`apex.com` / `app.apex.com`) with the shared cookie domain `.apex.com` in place.

2. **The Product App gets a standalone sign-in screen (`/sign-in`) for local development.** This screen calls `signInWithPassword` directly and is sufficient for all local testing during Stages 1–2. It will remain in the app post-launch as a fallback/alternative entry point.

3. **ADR 0009 is not wrong, only incomplete.** The production auth flow described there is correct. Only the "simulated via different localhost ports" claim is inaccurate and is struck from that document by this ADR.

## Alternatives Considered

### URL-Token Handoff

The marketing callback could encode the session tokens in the redirect URL and the product app could parse them on load. This works across origins but has security implications (tokens in URL = appear in server logs, browser history, Referer headers). Rejected for production use.

This approach should be reconsidered in Phase 13 if subdomain cookie sharing proves fragile in any deployment configuration. If revisited, tokens must be short-lived (< 60s), single-use, and the URL must be HTTPS-only.

### Unified Dev Domain

Running both apps under a single domain locally (e.g. via a reverse proxy mapping `apex.localhost` and `app.apex.localhost`) would allow cookie sharing. This adds setup complexity for a solo-founder project. Rejected for Stage 1; can be revisited if the team grows.

## Consequences

- **Local dev:** Product App has own sign-in; Marketing sign-up/in flows are tested in isolation only.
- **Production:** Handoff works as designed in ADR 0009 (shared `.apex.com` cookie domain).
- **Phase 13 obligation:** End-to-end Marketing→Product handoff must be verified after deployment. If it fails, implement URL-token handoff as described above.

## Outstanding Tasks

- [ ] **Re-enable email confirmation in Supabase Dashboard before production launch.** It was disabled during Phase 08 local testing. Supabase Dashboard → Authentication → Email → "Enable email confirmations" must be turned ON before Phase 13 deployment.
- [ ] Phase 13: verify Marketing→Product cookie handoff on real subdomains.
- [ ] Phase 13: if subdomain cookie sharing fails, implement URL-token handoff (short-lived, HTTPS-only).
