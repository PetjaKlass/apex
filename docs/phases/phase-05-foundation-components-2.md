# Phase 05 — Foundation Components: Form Controls + Avatar/Badge

> **Stage:** Alpha
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 04 complete

## Goal

Implement form-related components: Textarea, Select, Checkbox, Toggle, Radio. Plus Avatar and Badge. All per their specs in `docs/design-system/components/`.

## Why Now

Phase 04 covered the most-used. Phase 05 covers the second tier — needed for forms (onboarding Phase 11), settings, and metadata displays.

## Prerequisites

- Phase 04 complete
- packages/ui established with Button/Input/Card

## Scope

7 components implemented per their specs:

1. `<Textarea>` — multi-line, auto-resize, char count, Cmd+Enter submit
2. `<Select>` — custom dropdown (no native), searchable variant, mobile sheet pattern
3. `<Checkbox>` — including indeterminate, task variant, satisfying check animation
4. `<Toggle>` — iOS-style with drag-to-toggle gesture
5. `<Radio>` + `<RadioGroup>` — including card variant, segmented variant
6. `<Avatar>` — initials fallback (NEVER generic icon), color hash algorithm
7. `<Badge>` — count animations, custom tag colors

Plus Storybook stories + tests for each.

## Out of Scope

- Modal, Toast, Tooltip, Progress, Skeleton (Phase 06)
- Date/Time picker (later phase, complex)
- File upload component (Phase 18 vision card has image upload)

## Acceptance Criteria

- [ ] All 7 components match their specs (visual + behavioral)
- [ ] Textarea auto-resizes smoothly, character count updates correctly
- [ ] Select uses custom popover (verified: NO native `<select>` anywhere)
- [ ] Select has mobile sheet pattern below 640px
- [ ] Select keyboard navigation works (arrows, type-ahead)
- [ ] Checkbox check animation triggers haptic on mobile
- [ ] Checkbox indeterminate state works
- [ ] Toggle drag-to-toggle gesture works on mobile
- [ ] Radio segmented variant has sliding indicator (iOS Settings style)
- [ ] Avatar shows initials fallback (verified by clearing image URL)
- [ ] Avatar deterministic color (same name → same color always)
- [ ] Badge count animation on number change (slide up)
- [ ] All Storybook stories present
- [ ] All unit tests pass
- [ ] `pnpm typecheck` + `pnpm lint` pass

## Implementation Plan

1. **Textarea** (~2 hours) — auto-resize, char count, no transitions
2. **Select** (~5 hours) — most complex. Use Radix primitive on web, custom on native. Floating UI for positioning.
3. **Checkbox** (~2 hours) — Reanimated for check scale animation
4. **Toggle** (~3 hours) — Reanimated + Pan gesture for drag-to-toggle
5. **Radio + RadioGroup** (~2 hours) — Context for group state
6. **Avatar** (~2 hours) — color hash function, expo-image for image
7. **Badge** (~1 hour) — simple but with count animation
8. **Stories + tests** (~2 hours) — for all 7
9. **Test page integration** (~1 hour)
10. **Lint + commit** (~30 min)

## Files Created/Modified

**Created (in packages/ui/src/components/):**

- `Textarea.tsx` + `.stories.tsx` + `.test.tsx`
- `Select.tsx` + `.stories.tsx` + `.test.tsx`
- `Checkbox.tsx` + `.stories.tsx` + `.test.tsx`
- `Toggle.tsx` + `.stories.tsx` + `.test.tsx`
- `Radio.tsx` + `.stories.tsx` + `.test.tsx`
- `Avatar.tsx` + `.stories.tsx` + `.test.tsx`
- `Badge.tsx` + `.stories.tsx` + `.test.tsx`
- `packages/ui/src/utils/avatarColor.ts` (color hash function)

**Modified:**

- `packages/ui/src/index.ts` (re-exports new components)
- `apps/product/app/_test/components.tsx` (add new components)

## Common Pitfalls

**1. Select on native is HARD** — don't use Radix Select on native (web only). For native, use `@gorhom/bottom-sheet` for mobile sheet pattern, or custom popover with Reanimated.

**2. Checkbox haptic must be on press-down** — not on completion. Otherwise feels delayed.

**3. Toggle drag gesture conflicts with parent scroll** — use react-native-gesture-handler, configure properly to claim horizontal swipes.

**4. Radio segmented sliding indicator** — sometimes flickers on first render. Use `useEffect` to skip initial animation.

**5. Avatar color hash collision** — with 8 colors and many names, some collide. That's fine — predictability matters more than uniqueness.

**6. Badge count animation can stack** — if count changes rapidly (XP earning), debounce or batch updates.

**7. Textarea auto-resize on web** — use `field-sizing: content` (modern CSS) or hidden div mirror trick. Native uses `onContentSizeChange`.

## Done When

- All 7 components implemented and visually matching specs
- Storybook comprehensive
- Tests passing
- Petja tests interactions on real mobile device (haptics, drag gestures)
- Commit: `feat(ui): add Textarea, Select, Checkbox, Toggle, Radio, Avatar, Badge`

---

**Next:** `phase-06-foundation-components-3.md`
