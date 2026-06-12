# Phase 12 — Dashboard

> **Stage:** Alpha
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 11 complete

## Goal

Build the Dashboard — the home screen of Apex. Implements MomentumOrb and OBTHero components from specs. This is the most-visible screen in the entire app.

## Why Now

Onboarding (Phase 11) set up Vision, Goal, Habit, OBT. Dashboard is where users see them all integrated. Phase 13 then deploys the alpha for dogfooding.

## Prerequisites

- Phases 01-11 complete
- All foundation components ready
- Onboarding flow working

## Scope

1. Dashboard layout: hero left (MomentumOrb + OBTHero), today's tasks, today's habits, journal prompt
2. `<MomentumOrb>` per spec — implement fully (continuous pulse, count-up, particles deferred to Stage 2)
3. `<OBTHero>` per spec — implement fully (glow breathe, set-as-OBT moment)
4. Today's tasks widget (read-only for now, real interaction in Phase 14)
5. Today's habits widget (read-only for now, real interaction in Phase 15)
6. Greeting based on time of day + locale
7. Quick capture: Cmd+K opens command palette for task add
8. Empty states for new users
9. Date display: today's date in user locale

## Out of Scope

- Real task interaction (Phase 14)
- Real habit interaction (Phase 15)
- Focus Mode launch (Phase 16)
- Calendar widget (Phase 28)
- AI Coach integration (Phase 24)
- Live momentum calculation (Phase 17 — for now use placeholder XP store)

## Acceptance Criteria

- [ ] Dashboard renders post-login post-onboarding
- [ ] Greeting: "Guten Morgen, Petja" / "Good morning, Petja" — time-aware
- [ ] Date displayed: "Sonntag, 9. März" / "Sunday, March 9"
- [ ] MomentumOrb implemented per spec (pulse, number, count-up on changes)
- [ ] OBTHero implemented per spec (glow breathe, accent border)
- [ ] OBTHero handles all variants: default, empty, completed, tomorrow
- [ ] Today's tasks widget shows up to 5 tasks (using TaskRow placeholder)
- [ ] Today's habits widget shows up to 5 habits (using HabitCard placeholder)
- [ ] Journal prompt: "What happened today that mattered?" (link to Journal)
- [ ] Cmd+K opens command palette
- [ ] Command palette: search + add task quick action
- [ ] Empty states when no tasks/habits/OBT
- [ ] Hover lift on OBTHero (desktop)
- [ ] Tap MomentumOrb → opens momentum breakdown (placeholder for Stage 2)
- [ ] Reduced motion respected
- [ ] Dashboard renders < 2.0s LCP on 4G
- [ ] All accessibility ✓

## Implementation Plan

1. **Dashboard route** (~1 hour) — `app/(app)/dashboard/index.tsx`
2. **Dashboard layout** (~3 hours) — responsive grid, hero column + widgets column
3. **Greeting component** (~2 hours) — time-aware, locale-aware
4. **MomentumOrb component** (~6 hours) — full spec implementation, SVG + Reanimated
5. **OBTHero component** (~5 hours) — full spec, all variants
6. **Today's tasks widget** (~3 hours) — query today's tasks, render with TaskRow placeholder
7. **Today's habits widget** (~3 hours) — query today's habits, render with HabitCard placeholder
8. **Command palette** (~4 hours) — Cmd+K hotkey, search input, quick add
9. **Empty states** (~2 hours)
10. **Polish + tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/dashboard/index.tsx`
- `apps/product/components/dashboard/MomentumOrb.tsx`
- `apps/product/components/dashboard/OBTHero.tsx`
- `apps/product/components/dashboard/Greeting.tsx`
- `apps/product/components/dashboard/TodayTasksWidget.tsx`
- `apps/product/components/dashboard/TodayHabitsWidget.tsx`
- `apps/product/components/dashboard/JournalPromptWidget.tsx`
- `apps/product/components/CommandPalette.tsx`
- `apps/product/lib/momentum/calculator.ts` (placeholder, real impl Phase 17)
- `apps/product/components/tasks/TaskRow.tsx` (placeholder for now, real impl Phase 14)
- `apps/product/components/habits/HabitCard.tsx` (placeholder, real impl Phase 15)

## Common Pitfalls

**1. MomentumOrb performance** — continuous pulse animation on UI thread. Verify 60fps on low-end Android.

**2. SVG glow on native** — `react-native-svg` filter support varies by version. Test glow effect on iOS + Android.

**3. Particle effects deferred** — Stage 2+ feature. Don't try to implement in Phase 12.

**4. Time zone for greeting** — use system timezone. "Morning" = 5am-12pm, "Afternoon" = 12-18, "Evening" = 18-22, "Night" = 22-5.

**5. Cmd+K conflicts** — on Mac it's Cmd+K, Windows/Linux it's Ctrl+K. Cross-platform handling.

**6. TaskRow placeholder vs real** — Phase 14 replaces the placeholder. Define interface clearly so swap is clean.

**7. Empty states** — even on first login (no tasks yet), Dashboard must look great. Test post-onboarding empty case.

## Done When

- Dashboard renders correctly post-login
- All animations smooth at 60fps
- Petja sees Dashboard for first time and feels "yes, this is it"
- Empty states work
- Cmd+K command palette functional
- Commit: `feat(dashboard): hero MomentumOrb + OBTHero + widgets`

---

**Next:** `phase-13-deployment-dogfooding.md`
