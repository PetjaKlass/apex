# Deployment Runbook — Stage 1 Alpha (Phase 13)

> What ships in code vs. what needs Petja's accounts/dashboards. Code-side
> deliverables are done and committed; the items marked **[manual]** require
> external accounts and must be done by Petja.

## Done in code

- **PWA**: `apps/product/public/manifest.json`, icons (`public/icons/*`),
  `public/service-worker.js` (network-first, offline app-shell fallback),
  `app/+html.tsx` (manifest link, theme-color `#080706`, apple-touch-icon,
  SW registration — **production hosts only**, never on localhost).
- **Vercel config**: `apps/product/vercel.json` (region `fra1`, SPA rewrites,
  `dist` output, `no-cache` on the service worker) and
  `apps/marketing/vercel.json` (region `fra1`).
- **Smoke test**: `apps/product/e2e/smoke.spec.ts` (post-login load guard).
- **Dogfooding log**: `docs/dogfooding-log.md`.

## [manual] Production Supabase (Frankfurt)

1. Create a **separate** Supabase project `apex-prod` (region: Central EU / Frankfurt).
2. Link + push migrations: `supabase link --project-ref <prod-ref>` then
   `supabase db push`.
3. Configure Auth: email templates, redirect URLs (the prod product URL),
   enable **leaked-password protection** (the one advisor item still open).
4. Create the `powersync_role` password (migration `0022` uses a placeholder) and
   store it in a secrets manager.

## [manual] Production PowerSync (EU — Ireland)

1. Create an EU PowerSync instance.
2. Connect it to `apex-prod` using `powersync_role` credentials.
3. Configure Supabase JWT (JWKS endpoint), upload `powersync/sync-rules.yaml`.
4. Note the instance URL for `EXPO_PUBLIC_POWERSYNC_URL`.

## [manual] Vercel — both apps (monorepo)

Two Vercel projects from this repo:

- **Product**: Root Directory `apps/product`, Install `pnpm install` (repo root),
  Build/Output picked up from `apps/product/vercel.json`.
- **Marketing**: Root Directory `apps/marketing` (Next.js auto-detected).

Set env vars in each project (no `.env.local` in prod):

- Product: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`,
  `EXPO_PUBLIC_POWERSYNC_URL` (all **prod** values).
- Marketing: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- Service-role key stays server-only (never in a `NEXT_PUBLIC_`/`EXPO_PUBLIC_` var).

## [manual] Monitoring

- **Sentry** (EU): create projects, add DSN env vars, wire the SDK (deferred —
  no DSN committed). Scrub PII per `docs/decisions/0010-dsgvo-compliance.md`.
- **PostHog** (EU): project + key, instrument key events.
- **Plausible** (DE): already referenced via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

## [manual] DNS / domain

Use the Vercel subdomain (`*.vercel.app`) until the brand/domain is decided
(end of Stage 1). Point DNS to Vercel when ready; HTTPS is automatic.

## [manual] Verify on production

- Sign up → email → verify → product loads.
- `curl -I https://<prod>/@powersync/worker/WASQLiteDB.umd.js` → `application/javascript`
  (regression guard for the worker-path bug).
- Run the smoke test against prod: `E2E_PORT=443`-style not applicable; instead
  point `baseURL` at the prod URL or run the manual checks in Phase 13.
- Lighthouse ≥ 90; "Add to Home Screen" works on iOS Safari + Android Chrome;
  PWA installs on macOS/Windows desktop.

## [manual] Dogfooding

Install the PWA on laptop + desktop + phone, sign up + onboard on prod, then keep
`docs/dogfooding-log.md` daily. Day-14 retrospective → `docs/stage-1-retrospective.md`.
Tag when stable: `git tag v0.1.0-alpha && git push --tags`.
