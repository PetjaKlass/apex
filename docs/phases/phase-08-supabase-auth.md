# Phase 08 — Supabase Setup + Auth

> **Stage:** Alpha
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 07 complete

## Goal

Set up Supabase Dev project (Frankfurt), implement auth flows (signup, signin, magic link, password reset, email verification), establish JWT session management across both apps, and lay foundation for RLS.

## Why Now

Auth must exist before Database (Phase 09 needs RLS based on user_id). Marketing pages from Phase 07 had auth UI placeholders — now we wire them up.

## Prerequisites

- Phase 07 complete (auth UI exists)
- Supabase account exists (created in earlier setup)
- Supabase Dev project created in **Frankfurt region**
- Local Supabase CLI installed (per SETUP.md)

## Scope

1. Supabase Dev project: Frankfurt region, free tier
2. Local Supabase via CLI: `supabase init`, `supabase start`
3. Auth flows in Marketing Site: signup, signin, password reset, magic link
4. Email templates customized (basic Apex branding for now)
5. JWT session management with refresh
6. Auth handoff: Marketing signs user in → Product App receives session
7. RLS foundation: workspaces table + profiles table with policies
8. Edge Function "hello world" for testing
9. AVV signed (Datenverarbeitungsvertrag with Supabase) — Petja does manually

## Out of Scope

- Full database schema (Phase 09)
- PowerSync integration (Phase 09)
- Stripe integration (Phase 22)
- Two-factor auth (Phase 17+)
- OAuth providers (Google, Apple, GitHub) — defer for now, add in Phase 21

## Acceptance Criteria

- [ ] Supabase project URL + anon key in `.env.local` (NOT committed)
- [ ] `.env.example` template at root
- [ ] Local Supabase runs (`supabase start`) — verify tables, auth, storage UIs
- [ ] Migrations folder structure (`supabase/migrations/`)
- [ ] First migration: `workspaces` + `profiles` + `workspace_members` tables
- [ ] RLS policies on all three tables (verified: User A cannot read Workspace B)
- [ ] Email signup flow works end-to-end (signup → email verification → product app)
- [ ] Email signin flow works
- [ ] Password reset flow works (request → email → set new → signin)
- [ ] Magic link flow works
- [ ] Email templates branded (Apex name, basic styling)
- [ ] Supabase client wrapper in both apps with proper typing
- [ ] Generated TS types from DB schema (`supabase gen types typescript`)
- [ ] Auth state in Product App (logged in user displayed)
- [ ] Logout works
- [ ] Session refresh works (verify by waiting 1h+ and continuing to use app)
- [ ] Edge Function "hello-world" deployed and callable
- [ ] AVV signed with Supabase (Petja confirms outside of code)
- [ ] `pnpm typecheck` + `pnpm lint` pass

## Implementation Plan

1. **Supabase project setup** (~2 hours)
   - Project in Frankfurt, free tier
   - Save URL + anon key in `.env.local`
   - `.env.example` documents all env vars
   - Local Supabase CLI: `supabase init`, `supabase start`
2. **First migration** (~3 hours)
   - workspaces (id, name, type ['solo'|'duo'], owner_id, created_at)
   - profiles (id = auth.users.id, name, avatar_url, locale, created_at)
   - workspace_members (workspace_id, user_id, role)
   - RLS policies: profiles readable by self only, workspaces readable by members only
   - Seed data for testing
3. **Auth flows in Marketing** (~5 hours)
   - sign-up: createUser, send verification email
   - sign-in: signInWithPassword
   - reset-password: requestPasswordReset → token → updateUser
   - magic-link: signInWithOtp
   - All using next-intl for translated messages
   - Error handling with Toast component
4. **Email templates** (~2 hours)
   - Customize Supabase email templates with Apex branding
   - Verification email, password reset, magic link
   - Test all delivery
5. **Session handoff Marketing → Product** (~2 hours)
   - On successful auth in Marketing: redirect to `app.apex.[domain]`
   - Locally: redirect to `http://localhost:8081` (Expo)
   - Session shared via Supabase cookies (same project = same session)
   - Product App reads session on load
6. **Auth state in Product App** (~3 hours)
   - `lib/supabase.ts` client wrapper
   - `lib/auth/AuthProvider.tsx` context
   - `useAuth()` hook
   - Redirect to Marketing sign-in if not authenticated
   - Show user's name on screen (proof it works)
7. **Edge Function** (~2 hours)
   - `supabase/functions/hello-world/index.ts`
   - Deploy: `supabase functions deploy hello-world`
   - Test: call from Product App with auth, verify response
8. **TS type generation** (~1 hour)
   - Add npm script: `pnpm types:gen`
   - Generates `packages/types/src/database.ts`
   - Used by Supabase client for full type safety
9. **AVV processing** (Petja, ~30 min)
   - Sign Supabase Auftragsverarbeitungsvertrag (DPA)
   - Save in personal records
10. **Tests + commit** (~3 hours)

## Files Created/Modified

**Created:**

- `.env.example`
- `.env.local` (gitignored)
- `supabase/config.toml`
- `supabase/migrations/0001_initial_schema.sql`
- `supabase/seed.sql`
- `supabase/functions/hello-world/index.ts`
- `packages/types/package.json`
- `packages/types/src/database.ts` (generated)
- `packages/types/src/index.ts`
- `apps/marketing/lib/supabase.ts`
- `apps/marketing/app/[locale]/(auth)/sign-in/actions.ts`
- `apps/marketing/app/[locale]/(auth)/sign-up/actions.ts`
- `apps/marketing/app/[locale]/(auth)/reset-password/actions.ts`
- `apps/product/lib/supabase.ts`
- `apps/product/lib/auth/AuthProvider.tsx`
- `apps/product/lib/auth/useAuth.ts`

**Modified:**

- `apps/marketing/app/[locale]/(auth)/sign-in/page.tsx` (wire up)
- `apps/marketing/app/[locale]/(auth)/sign-up/page.tsx`
- `apps/marketing/app/[locale]/(auth)/reset-password/page.tsx`
- `apps/product/app/_layout.tsx` (wrap in AuthProvider)
- `apps/product/app/index.tsx` (show user name if logged in)

## Common Pitfalls

**1. Supabase region MUST be Frankfurt** — once project created, region is fixed. If wrong region, must delete + recreate.

**2. Local Supabase + cloud Supabase differ** — local is Docker-based, cloud is hosted. Develop against local mostly, deploy migrations to cloud manually.

**3. `.env.local` accidentally committed** — verify `.gitignore` excludes it. Run `git status` before commit.

**4. Auth cookie domain** — when Marketing is on `apex.com` and Product on `app.apex.com`, cookies need `domain=.apex.com`. Locally, both on `localhost` works automatically.

**5. RLS policies wrong way** — easy to write policies that lock yourself out. Test as different users immediately.

**6. Email delivery in dev** — Supabase Free tier has rate limits on auth emails. Use mock email or be patient.

**7. TypeScript types out of date** — every migration must regenerate types. Add to git pre-commit if migrations changed.

**8. Edge Function CORS** — by default blocks cross-origin. Configure properly for both apps.

**9. JWT expiry** — default 1 hour. Refresh logic needed in client. Supabase JS client handles this but verify.

## Done When

- User can sign up via Marketing Site, verify email, sign in, see Product App with their name
- User can reset password successfully
- Magic link login works
- Logout clears session in both apps
- RLS verified by manual SQL queries (impersonate user, check what they can see)
- AVV signed with Supabase
- Edge Function returns valid response
- Commit: `feat(auth): supabase setup + auth flows + RLS foundation`

---

**Critical security note:** This phase touches authentication. Do NOT skip RLS testing. A misconfigured RLS policy = data leak.

**Next:** `phase-09-database-powersync.md` (most complex phase in Stage 1)
