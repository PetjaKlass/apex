# Phase 17 — XP / Levels / Momentum / Badges

> **Stage:** Beta
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 16 complete

## Goal

Build the complete gamification engine: XP calculation, level progression, momentum decay, badge unlock conditions, level-up overlay, badge unlock animations. Replace all "XP placeholder" code from previous phases with real engine.

## Why Now

Previous phases (14, 15, 16) added "log XP placeholder" calls. Now we make those real. Gamification is the retention multiplier — users come back daily because they don't want to break momentum.

## Prerequisites

- Phases 14, 15, 16 complete (XP events being logged)
- xp_events, xp_state, badges tables exist (Phase 09)

## Scope

1. XP engine: pure functions for calculating XP per action
2. Level calculation: XP thresholds per level (formula, not hardcoded)
3. Momentum engine: cumulative XP with decay over time
4. 30+ predefined badges with unlock conditions
5. Level-up overlay animation (1500ms sequence)
6. Badge unlock animation
7. Streak Shield management UI (Settings)
8. Settings: toggle XP/Level visibility (show/hide gamification entirely)
9. Achievement page: badges earned + in-progress
10. Real MomentumOrb data (replaces Phase 12 placeholder)
11. Real XP toasts (replaces Phase 14-16 placeholders)

## Out of Scope

- Mythic mode (Stage 3, Phase 30)
- Social features (leaderboards) — explicitly NOT in Apex
- Public profile (NOT in Apex)

## Acceptance Criteria

- [ ] XP engine: pure functions tested for all event types
- [ ] Level formula deterministic: e.g., level n requires `n^2 * 100` XP
- [ ] Momentum: cumulative XP with daily decay (configurable rate)
- [ ] 30+ badges defined with unlock conditions (in code, not DB-driven)
- [ ] Level-up overlay: full-screen, 1500ms ceremony, accent burst, "Level X — [Title]"
- [ ] Badge unlock: subtle modal-like notification + Achievement page badge
- [ ] Streak Shield: Settings shows "1 of 1 available, resets [date]"
- [ ] Settings: toggle XP visibility (when off, MomentumOrb hidden, no XP toasts)
- [ ] Achievement page: list earned + progress on unearned
- [ ] MomentumOrb: real momentum value, count-up on changes
- [ ] XP toasts: real XP from real events
- [ ] Decay calculation: scheduled (Edge Function daily) updates momentum
- [ ] All previous "placeholder" code removed
- [ ] Tests cover edge cases: max level, 0 XP, decay to 0
- [ ] Reduced motion: simplified animations
- [ ] Engine works offline (local SQLite calculations)

## Implementation Plan

1. **XP engine** (~4 hours) — `lib/xp/engine.ts` pure functions, full test coverage
2. **Level formula** (~1 hour) — quadratic, max level 100, level titles
3. **Momentum engine** (~3 hours) — cumulative + decay function
4. **Badge definitions** (~3 hours) — 30+ badges in `lib/badges/definitions.ts`
5. **Badge engine** (~2 hours) — checks unlock conditions on each XP event
6. **Level-up overlay** (~4 hours) — full ceremony, particles, sound (subtle), accent burst
7. **Badge unlock animation** (~2 hours)
8. **Streak Shield UI** (~2 hours) — Settings page section
9. **XP visibility toggle** (~1 hour) — Settings + conditional rendering
10. **Achievement page** (~3 hours) — list + progress
11. **MomentumOrb integration** (~2 hours) — replace placeholder data
12. **Replace XP placeholders** (~2 hours) — Phase 14, 15, 16 code
13. **Decay scheduled function** (~2 hours) — Supabase Edge Function, daily cron
14. **Tests + commit** (~3 hours)

## Files Created/Modified

**Created:**

- `apps/product/lib/xp/engine.ts`
- `apps/product/lib/xp/engine.test.ts`
- `apps/product/lib/xp/levels.ts`
- `apps/product/lib/momentum/engine.ts`
- `apps/product/lib/momentum/engine.test.ts`
- `apps/product/lib/badges/definitions.ts`
- `apps/product/lib/badges/checker.ts`
- `apps/product/components/gamification/LevelUpOverlay.tsx`
- `apps/product/components/gamification/BadgeUnlockToast.tsx`
- `apps/product/components/gamification/StreakShieldUI.tsx`
- `apps/product/app/(app)/achievements/index.tsx`
- `supabase/functions/momentum-decay/index.ts` (daily cron)

**Modified:**

- `apps/product/components/dashboard/MomentumOrb.tsx` (real data)
- `apps/product/components/tasks/TaskRow.tsx` (real XP toast)
- `apps/product/components/habits/HabitCard.tsx` (real XP toast)
- `apps/product/components/focus/FocusTimer.tsx` (real XP on completion)
- `apps/product/app/(app)/settings/index.tsx` (XP toggle, Streak Shield)

## Common Pitfalls

**1. XP engine not pure** — must be deterministic for testing. No randomness, no Date.now() inside (pass timestamp as arg).

**2. Decay timing** — runs daily as cron. Must handle missed days (catch-up logic).

**3. Badge unlock race condition** — check on XP event vs on aggregation. Decide one model.

**4. Level-up while in Focus Mode** — suppress overlay until session ends? Yes (don't break flow).

**5. XP toast batching** — if 3 tasks completed in 2 seconds, 3 toasts feels spammy. Batch (per Toast spec).

**6. Mythic mode** — explicitly NOT in this phase. Phase 30.

**7. Decay function complexity** — keep it simple: -X% per day of inactivity. Don't overthink.

**8. Settings toggle disables MomentumOrb but engine still calculates** — correct. Re-enabling shows current value.

## Done When

- Petja completes tasks, habits, focus sessions and sees real momentum + level updates
- Level-up overlay tested with manual trigger
- 5+ badges naturally unlocked through 7 days of dogfooding
- Decay function runs successfully overnight
- All "placeholder" code removed
- Commit: `feat(gamification): full XP engine + momentum + badges`

---

**Next:** `phase-18-vision-goals.md`
