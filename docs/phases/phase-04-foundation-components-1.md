# Phase 04 — Foundation Components: Button, Input, Card

> **Stage:** Alpha
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 03 complete

## Goal

Implement the three most-used components per their specs: Button, Input, Card. Each with all variants, states, micro-interactions, accessibility per `docs/design-system/components/*.md`.

## Why Now

Once tokens (Phase 02) and i18n (Phase 03) exist, components can be built. We start with the three most-used (every screen needs these). Doing them first proves the design system end-to-end.

## Prerequisites

- Phases 01-03 complete
- `packages/design-tokens` exports working
- NativeWind v4.1 active in Product App
- Theme switching works in test pages

## Scope

1. `packages/ui` package created (shared components for both apps)
2. `<Button>` per `button.md` spec — all 7 variants, all states, micro-interactions
3. `<Input>` per `input.md` spec — all variants, zero typing lag verified
4. `<Card>` per `card.md` spec — all 8 variants, compound pattern (Card.Header, Card.Body, Card.Footer)
5. Storybook setup in `packages/ui` — stories for all variants × states × themes
6. Each component works in BOTH Marketing and Product App identically
7. Unit tests for component behavior (Vitest)

## Out of Scope

- Other components (Phases 05-06)
- Storybook deployment to public URL (later, optional)
- Visual regression tests (Phase 24+)
- Tooltip integration in icon-only buttons (Phase 06 has Tooltip)

## Acceptance Criteria

### Per-component

- [ ] Button: all 7 variants render correctly in both themes × all 5 accents (35 combos verified)
- [ ] Button: press-down haptic on mobile (verify on physical device or Expo Go)
- [ ] Button: chevron slide on hover (web)
- [ ] Button: loading state with 300ms minimum hold
- [ ] Input: zero typing lag verified (type fast on mid-range device)
- [ ] Input: German Umlauts work (test "Größe €100 für Müller")
- [ ] Input: search debounce + clear button
- [ ] Card: all 8 variants render
- [ ] Card: hover translateY(-1px) on web (interactive variant)
- [ ] Card: compound pattern works (Card.Header, Card.Body, Card.Footer)

### Cross-cutting

- [ ] All three components accessible (WCAG AA verified)
- [ ] Reduced motion respected (animations off when system flag set)
- [ ] Components work identically web + native
- [ ] Storybook runs (`pnpm storybook` in packages/ui)
- [ ] Storybook has stories for every variant × state combo
- [ ] Unit tests pass (>80% coverage on these three)
- [ ] `pnpm typecheck` + `pnpm lint` pass

## Implementation Plan

1. **packages/ui setup** (~1 hour) — create package, exports, Storybook
2. **Button** (~6 hours) — full spec implementation
   - cva (class-variance-authority) for variants
   - Reanimated worklet for press-down scale
   - expo-haptics on press
   - Loading state with hold time
3. **Input** (~5 hours) — full spec
   - NO transitions on input itself (typing lag prevention)
   - Trailing icons (clear, password toggle)
   - Auto-fill theme override
4. **Card** (~5 hours) — full spec
   - Compound component pattern
   - Hover translateY (web only)
   - Conditional Pressable wrapper for interactive variant
5. **Storybook stories** (~3 hours) — variants × states × themes × accents grid
6. **Tests** (~2 hours) — Vitest unit tests
7. **Test page integration** (~1 hour) — render all three on a single test page in Product App
8. **Polish + lint + commit** (~1 hour)

## Files Created/Modified

**Created:**

- `packages/ui/package.json`
- `packages/ui/tsconfig.json`
- `packages/ui/src/index.ts`
- `packages/ui/src/components/Button.tsx`
- `packages/ui/src/components/Input.tsx`
- `packages/ui/src/components/Card.tsx`
- `packages/ui/src/components/Button.stories.tsx`
- `packages/ui/src/components/Input.stories.tsx`
- `packages/ui/src/components/Card.stories.tsx`
- `packages/ui/src/components/Button.test.tsx`
- `packages/ui/src/components/Input.test.tsx`
- `packages/ui/src/components/Card.test.tsx`
- `packages/ui/.storybook/main.ts`
- `packages/ui/.storybook/preview.ts`
- `apps/product/app/_test/components.tsx` (test page)
- `apps/marketing/app/_test/components/page.tsx`

## Common Pitfalls

**1. Reanimated worklet syntax** — Reanimated v3 syntax differs from v2. Use `useAnimatedStyle` + `withSpring` properly. Check docs.

**2. cva v0.7+ API change** — class-variance-authority v0.7+ requires `compoundVariants` for multi-prop variants. Older tutorials use deprecated syntax.

**3. Pressable focus on web** — `Pressable` from react-native doesn't auto-handle keyboard focus on web. Use `tabIndex={0}` and keyboard handlers.

**4. expo-haptics on web** — wrap haptic calls in `Platform.OS !== 'web'` check, otherwise crash.

**5. Storybook 8 vs 9** — use Storybook 8.x for now (stable). Configure for both web + native (RN Storybook).

**6. Card compound pattern TS** — Use `Object.assign` or namespace export pattern for `Card.Header` syntax. Not all bundlers handle namespaces well.

**7. Input typing lag from transitions** — DOUBLE CHECK. Open Chrome DevTools Performance tab, type rapidly, verify no Recalculate Style spikes per keystroke.

## Done When

- All three components match their specs visually + behaviorally
- Storybook shows all variants comprehensively
- Tests pass
- Test page in both apps renders identically
- Petja personally tests typing in Input (no lag), pressing Button (haptic), hovering Card (subtle lift)
- Commit: `feat(ui): add Button, Input, Card components per spec`

---

**Next:** `phase-05-foundation-components-2.md`
