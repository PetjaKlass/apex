# Phase 15 — Habits & Streaks

> **Stage:** Beta
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 14 complete

## Goal

Complete habit tracking feature with all 4 frequency types, streak engine, Streak Shield mechanic, 90-day heatmap, and HabitCard component per spec. Replace Phase 12 placeholder.

## Why Now

Habits are the second daily-use feature. Phase 14 nailed Tasks; now we make Habits equally polished. The streak system creates retention.

## Prerequisites

- Phase 14 complete
- Habits + habit_logs tables exist (Phase 09)

## Scope

1. `<HabitCard>` per `habit-card.md` spec — full implementation
2. Habits page with all habits visible
3. Habit creation: 4 frequency types (daily, x_per_week, specific_days, weekly)
4. Identity statement editor (the "I am someone who..." field)
5. Streak calculation engine (PURE function, fully tested)
6. Streak Shield mechanic (1 free per month)
7. 90-day Heatmap component
8. Week grid component
9. Habit completion celebration choreography (5 phases)
10. XP rewards (placeholder, real Phase 17)
11. Pause / Archive flow
12. Co-ownership for Duo workspaces

## Out of Scope

- Real XP engine (Phase 17)
- Habit reminder push notifications (Phase 21 mobile)
- Habit suggestions from AI (Phase 24)

## Acceptance Criteria

- [ ] HabitCard renders correctly for all 4 frequency types
- [ ] Identity statement always visible
- [ ] Streak flame: count, milestone animations (7/30/90/365 days)
- [ ] Week grid: shows correct days for frequency type
- [ ] 90-day heatmap renders smoothly
- [ ] Completion choreography: 5 phases per spec (1.1s total)
- [ ] Streak Shield UI: when used, today's day shows shield icon
- [ ] Streak engine pure function tested with edge cases (timezone, DST, shield)
- [ ] Habit creation modal: all 4 frequencies + identity statement field
- [ ] At-risk streak nudge (subtle warning when not yet logged today by evening)
- [ ] Streak break: reset gracefully, no shaming copy
- [ ] Habits page: all habits in responsive grid
- [ ] Pause / Archive flows
- [ ] Co-owned habits: both partners' avatars shown
- [ ] FlashList for habit grids
- [ ] All animations 60fps
- [ ] Reduced motion respected
- [ ] Accessibility: ARIA for streak count, completion state

## Implementation Plan

1. **Streak engine** (~4 hours) — pure functions in `lib/habits/streakCalculator.ts`. Unit tests for all edge cases.
2. **HabitCard component** (~10 hours) — full spec implementation
3. **Sub-components** (~4 hours) — HabitFlame, WeekGrid, Heatmap (separate components)
4. **Habit creation** (~3 hours) — modal with all fields, frequency type radio, identity textarea
5. **Habit detail panel** (~3 hours) — full stats, edit, archive, delete
6. **Streak Shield UI** (~2 hours) — settings to use, indicator on heatmap
7. **At-risk nudge** (~2 hours) — visual only (notifications come Phase 21)
8. **Habits page layout** (~2 hours) — responsive grid
9. **XP placeholder** (~30 min)
10. **Tests + commit** (~3 hours)

## Files Created/Modified

**Created:**

- `apps/product/components/habits/HabitCard.tsx` (REAL implementation)
- `apps/product/components/habits/HabitFlame.tsx`
- `apps/product/components/habits/WeekGrid.tsx`
- `apps/product/components/habits/Heatmap.tsx`
- `apps/product/components/habits/HabitCreateModal.tsx`
- `apps/product/components/habits/HabitDetailPanel.tsx`
- `apps/product/lib/habits/streakCalculator.ts`
- `apps/product/lib/habits/streakCalculator.test.ts`
- `apps/product/lib/habits/queries.ts`
- `apps/product/app/(app)/habits/index.tsx` (real page)
- `apps/product/app/(app)/habits/[id].tsx` (detail)

## Common Pitfalls

**1. Streak calculation timezones** — what counts as "today"? User's local timezone. DST edge cases when day shifts.

**2. Frequency type math complexity** — `x_per_week` and `specific_days` have different streak rules. Test thoroughly.

**3. Streak Shield logic** — user can use 1 per calendar month. Reset on month boundary. Don't allow stockpiling.

**4. Completion choreography sub-1.1s** — must coordinate Reanimated, haptics, sound. State machine helps.

**5. Heatmap performance** — 90 days × multiple habits = many SVG nodes. Use single SVG path instead of individual rects if possible.

**6. Co-owned habits sync** — both users' completion logged independently. Joint streak only if both completed.

**7. Identity statement validation** — must start with "I am" or "I'm" (gentle nudge, not enforced)? Decide UX.

## Done When

- All 4 frequency types feel right
- Streak engine bulletproof (edge cases tested)
- Petja maintains a habit for 7+ days using it
- HabitCard matches spec
- Commit: `feat(habits): full implementation with streak engine`

---

**Next:** `phase-16-focus-mode.md`
