# Phase 11 — Onboarding Flow

> **Stage:** Alpha
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 10 complete

## Goal

Build the identity-first onboarding flow that takes new users from "just signed up" to "has Vision, Goal, Habit, OBT set, ready to start using Apex daily."

## Why Now

Phase 10 built the empty shell. Without onboarding, users sign up and see emptiness — guaranteed abandonment. Onboarding is the critical first impression.

## Prerequisites

- Phase 10 complete (shell + routing)
- Auth + Database + Sync working

## Scope

Onboarding steps (full-screen takeover):

1. Welcome screen — "Welcome to Apex" identity-first messaging
2. Identity selection — "Who are you becoming?" (Solo Founder, Operator, Creator, etc.)
3. Workspace creation — Solo or Duo workspace (with partner invite if Duo)
4. First Vision setup — title, statement, horizon, optional image upload
5. First Goal — linked to Vision, has Key Results
6. First Habit — with identity statement, frequency type
7. First OBT (today's One Big Thing) — pick from goal-derived suggestions
8. Onboarding complete celebration

Plus:

- Skip options (return to onboarding later)
- Onboarding state persisted (don't repeat)
- Progress indicator at top
- Back button between steps
- Consent / DSGVO confirmation

## Out of Scope

- Post-onboarding tutorial overlay (defer to Stage 2)
- Email drip campaign for re-engagement (Phase 23)
- A/B testing different flows (later)
- Real Duo partner invite flow (later phase, complex)

## Acceptance Criteria

- [ ] Welcome screen with identity-first copy
- [ ] Identity selector (5-7 preset roles + custom)
- [ ] Workspace creation: name, type, accent picker, optional emoji
- [ ] Vision: title, future-self statement, 1/3/5-year horizon
- [ ] Vision: optional image upload (or skip)
- [ ] Goal: title, linked to Vision, deadline, key results (1-3)
- [ ] Habit: title, identity statement, frequency type, target
- [ ] OBT: title (auto-suggest from Goal's tasks if any, or manual)
- [ ] Celebration screen after completion (subtle, premium)
- [ ] Back button works between steps
- [ ] Skip option available with confirmation
- [ ] DSGVO consent checkbox (privacy policy + terms)
- [ ] Progress indicator (5/7 etc.)
- [ ] State persisted (refresh mid-onboarding, resume from step)
- [ ] Onboarding complete flag in `profiles` table
- [ ] Skip onboarding for returning users (auto-redirect to dashboard)
- [ ] All flows in EN + DE
- [ ] Reduced motion respected
- [ ] Accessibility verified

## Implementation Plan

1. **Onboarding routing** (~1 hour) — `app/onboarding/_layout.tsx` with full-screen takeover
2. **Welcome screen** (~2 hours)
3. **Identity selector** (~3 hours) — RadioGroup card variant from Phase 05
4. **Workspace creation** (~3 hours) — create record in `workspaces`, add user as owner
5. **Vision creation** (~3 hours) — Textarea for statement, image upload (defer real upload to Phase 18 if complex)
6. **Goal creation** (~3 hours) — title, deadline, KRs (subform)
7. **Habit creation** (~3 hours) — frequency type radio (segmented variant), identity statement
8. **OBT selection** (~2 hours)
9. **Celebration screen** (~2 hours) — subtle confetti, identity-affirming copy
10. **Skip + back navigation** (~2 hours)
11. **State persistence + flag** (~2 hours)
12. **Accessibility + DSGVO** (~2 hours)
13. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created (apps/product/app/onboarding/):**

- `_layout.tsx`
- `welcome.tsx`
- `identity.tsx`
- `workspace.tsx`
- `vision.tsx`
- `goal.tsx`
- `habit.tsx`
- `obt.tsx`
- `complete.tsx`

**Created elsewhere:**

- `apps/product/components/onboarding/StepHeader.tsx`
- `apps/product/components/onboarding/StepFooter.tsx`
- `apps/product/components/onboarding/IdentityCard.tsx`
- `apps/product/lib/onboarding/store.ts` (Zustand for in-progress state)
- `supabase/migrations/0014_onboarding_complete.sql` (add column to profiles)

## Common Pitfalls

**1. Onboarding state in URL vs. state** — use Zustand store for in-progress data. Persist to mmkv. URL only for current step.

**2. Required vs optional steps** — only Workspace is truly required. Everything else can be skipped (with sensible defaults: vision can be created later, etc.).

**3. Image upload in Vision** — Supabase Storage upload is its own beast. For onboarding, allow skip and add image later in Phase 18.

**4. DSGVO consent** — must be active opt-in (no pre-checked box). Required to proceed.

**5. Identity copy** — Petja must write/approve the identity options. Don't generic them ("creative person", "businessman"). Should feel specific.

**6. Onboarding too long** — if it takes more than 5 minutes, users abandon. Aim for 2-3 minutes total. Offer skips generously.

**7. Returning user onboarding** — check flag on every login. Don't show flow if already completed.

## Done When

- Petja completes a full onboarding personally and feels good about it
- Returning user sees dashboard, not onboarding
- Skip works correctly
- All data persisted in DB correctly
- DSGVO consent properly captured
- Commit: `feat(onboarding): identity-first onboarding flow`

---

**Next:** `phase-12-dashboard.md`
