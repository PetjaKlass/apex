# Phase 06 — Foundation Components: Modal, Toast, Tooltip, Progress, Skeleton

> **Stage:** Alpha
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 05 complete

## Goal

Implement feedback and layout components per specs: Modal/Sheet/Drawer (cross-platform), Toast (incl. XP variant), Tooltip, Progress (linear + circular), Skeleton.

## Why Now

These complete the foundation 15-component set. Phase 07 (Marketing Site) and Phase 11 (Onboarding) need these.

## Prerequisites

- Phases 01-05 complete
- `packages/ui` has 8 components so far

## Scope

5 components (some with sub-components):

1. `<Modal>` / `<Sheet>` / `<Drawer>` — adaptive cross-platform per spec
2. `<Toast>` + `<ToastProvider>` — 5 variants including special XP variant with count-up
3. `<Tooltip>` — 600ms delay, keyboard variant
4. `<Progress>` (linear) + `<CircularProgress>` — with Conviction gradient variant + Pomodoro variant
5. `<Skeleton>` + pre-built compositions (TaskRowSkeleton, HabitCardSkeleton, etc.)

## Out of Scope

- Apex-specific components (TaskRow, HabitCard, etc.) — those come in Stage 2
- Real Pomodoro logic (Phase 16)
- Real toast queueing for XP events (Phase 17 has XP engine)

## Acceptance Criteria

- [ ] Modal renders as Modal on desktop, Sheet on mobile (auto-detected)
- [ ] Modal backdrop blur works on modern browsers, degrades gracefully
- [ ] Modal drag-to-dismiss works on mobile sheets
- [ ] Modal focus trap correct (Tab cycles within)
- [ ] Toast: all 5 variants render correctly
- [ ] Toast: XP variant has count-up animation (test with manual trigger)
- [ ] Toast: hover pause works (web)
- [ ] Toast: stack management (max 5 visible)
- [ ] Tooltip: 600ms delay before show
- [ ] Tooltip: continuity (faster delay for sibling)
- [ ] Tooltip: keyboard variant renders shortcut keys with `<kbd>` styling
- [ ] Progress: linear with spring fill animation
- [ ] Progress: gradient variant works (Conviction Score visual)
- [ ] CircularProgress: smooth 60fps over long durations (50min Pomodoro test)
- [ ] Skeleton: shimmer animates at 1.5s loop
- [ ] Skeleton: useDelayedSkeleton hook prevents flash on fast loads
- [ ] All Storybook stories present
- [ ] All tests pass

## Implementation Plan

1. **Modal cross-platform** (~5 hours) — Radix Dialog for web, @gorhom/bottom-sheet for mobile, custom Drawer for desktop. Adaptive logic.
2. **Toast** (~4 hours) — Sonner library on web, custom on native. XP variant with count-up via rAF.
3. **Tooltip** (~3 hours) — Radix Tooltip on web, react-native-popover-view on native. 600ms delay logic.
4. **Progress + CircularProgress** (~4 hours) — Reanimated for fill, SVG (react-native-svg) for circle. Gradient variant uses LinearGradient.
5. **Skeleton + compositions** (~3 hours) — primitive + 5-6 pre-built compositions (TaskRowSkeleton, HabitCardSkeleton, CardSkeleton, AvatarSkeleton, DashboardSkeleton)
6. **useDelayedSkeleton hook** (~30 min)
7. **Stories + tests** (~3 hours)
8. **Polish + commit** (~1 hour)

## Files Created/Modified

**Created (packages/ui/src/components/):**

- `Modal.tsx` + stories + tests
- `Toast.tsx` + `ToastProvider.tsx` + stories + tests
- `Tooltip.tsx` + stories + tests
- `Progress.tsx` + `CircularProgress.tsx` + stories + tests
- `Skeleton.tsx` + stories + tests
- `skeletons/TaskRowSkeleton.tsx`
- `skeletons/HabitCardSkeleton.tsx`
- `skeletons/CardSkeleton.tsx`
- `skeletons/AvatarSkeleton.tsx`
- `skeletons/DashboardSkeleton.tsx`
- `packages/ui/src/hooks/useDelayedSkeleton.ts`

**Modified:**

- `packages/ui/src/index.ts`
- App roots wrap in ToastProvider
- App roots wrap in TooltipProvider (for Radix on web)

## Common Pitfalls

**1. Modal stack confusion** — design system says NEVER stack modals. Enforce in code: throw error if Modal renders inside another Modal context.

**2. Sonner vs custom toast on native** — Sonner is web-only. Build custom on native or use react-native-toast-message + heavy customization.

**3. Backdrop blur performance** — `backdrop-filter: blur(8px)` is GPU-cheap on modern devices but kills older mobile. Test on iPhone 11 minimum.

**4. SVG circle dashoffset on web** — works but stroke-linecap: round can cause subtle visual artifacts at 0% and 100%. Test edge cases.

**5. Pomodoro 60fps for 50 minutes** — that's 180,000 frames. Reanimated worklet stays on UI thread, but verify no jank on low-end Android.

**6. Tooltip portal** — Tooltips inside scrollable content can clip. Use Portal to render at body level.

**7. Skeleton shimmer on native** — can't use CSS pseudo-elements. Use Reanimated translateX of a gradient overlay child.

## Done When

- All 5 components match specs
- Test page demonstrates each in action
- 50-minute Pomodoro test runs without dropped frames (manual verification)
- Reduced motion verified (skeleton shimmer disables, toast appears instant)
- Commit: `feat(ui): add Modal, Toast, Tooltip, Progress, Skeleton`

---

**End of foundation components.** Total: 15 components in `packages/ui`.

**Next:** `phase-07-marketing-foundation.md`
