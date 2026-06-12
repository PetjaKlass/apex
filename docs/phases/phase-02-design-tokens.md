# Phase 02 — Design Tokens & Theme System

> **Stage:** Alpha
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 01 complete

---

## Goal

Implement the complete design token system as a shared package, generate Tailwind preset for both apps, build theme provider with runtime switching (dark/light/system) and accent system (5 presets + custom).

By the end: changing accent or theme in one place updates both Marketing Site and Product App identically.

## Why Now

Design tokens MUST exist before any component is built. Phase 04 (Button, Input, Card) needs tokens. If we build components first then retrofit tokens, we will rewrite everything. So: tokens first.

## Prerequisites

- Phase 01 complete and verified
- `pnpm dev` runs both apps successfully
- TypeScript strict working in both apps

## Scope

1. `packages/design-tokens` workspace package
2. Token TypeScript file (single source of truth) per `design-system.md` Section 2
3. Tailwind preset generation
4. Theme provider for Product App
5. CSS variables for runtime theme switching
6. Accent system (5 presets + custom hex picker)
7. NativeWind v4.1 setup in Product App (was deferred from Phase 01)
8. Integration test: change theme/accent, see both apps respond

## Out of Scope

- Components (Phase 04+)
- Theme picker UI (Phase 11 settings)
- Dark/Light auto-switch by time of day (later, optional)
- High contrast mode (Phase 17+)
- Custom user-defined accents persisting to DB (Phase 09 has the user_settings table)

## Acceptance Criteria

- [ ] `packages/design-tokens/tokens.ts` exists with full token export per design-system.md
- [ ] `packages/design-tokens/tailwind-preset.ts` generates valid Tailwind config
- [ ] `packages/design-tokens/themes.ts` has dark + light theme color objects
- [ ] `packages/design-tokens/accents.ts` has 5 preset accents (gold, silver, rose, sapphire, emerald)
- [ ] `packages/design-tokens` exports types: `Theme`, `Accent`, `ThemeColors`, `AccentValues`
- [ ] Marketing Site: extends design-tokens preset, theme switching works via `[data-theme]` and `[data-accent]` attributes on root
- [ ] Product App: NativeWind v4.1 installed and configured with shared preset
- [ ] Product App: ThemeProvider context with `theme` + `accent` state
- [ ] Test page in both apps shows: current theme name, accent name, sample swatches
- [ ] Toggle button in test page changes theme — both apps update without reload
- [ ] All token contrasts pass WCAG AA (validated in tests)
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] No magic numbers in CSS — only token references

## Implementation Plan

### Step 1: Create design-tokens package (~30 min)

```bash
mkdir -p packages/design-tokens/src
cd packages/design-tokens
```

Create `package.json` with name `@apex/design-tokens`, peer deps on TypeScript.

### Step 2: Write tokens.ts (~2 hours)

Implement all token categories from `design-system.md` Section 2:

- spacing (8px grid)
- radius
- fontSize, fontFamily, fontWeight, letterSpacing, lineHeight
- zIndex layers
- shadow
- duration, easing
- layoutLayers

Export as `const tokens = { ... } as const` for type safety.

### Step 3: Write themes.ts + accents.ts (~2 hours)

Per design-system.md Section 3:

- `dark` theme (warm black #080706 base)
- `light` theme (warm off-white #F5F3EE base)
- 5 preset accents with all 7 values each (base, bright, dim, glow, border, text, shadowAccent)
- Helper function for custom accent (HSL transformations)

### Step 4: Tailwind preset (~1 hour)

`packages/design-tokens/tailwind-preset.ts`:

- Maps tokens to Tailwind config format
- Includes color palette
- Includes spacing/radius/fontSize scales
- Exportable as Tailwind preset

### Step 5: Marketing Site integration (~1 hour)

- `apps/marketing/tailwind.config.ts` extends design-tokens preset
- Root layout sets `data-theme` and `data-accent` attributes
- CSS variables defined in `globals.css` for runtime swap
- Theme toggle button (test page only, real UI later)

### Step 6: Product App NativeWind setup (~2 hours)

This is the deferred Phase 01 task. Follow `nativewind.dev/docs/getting-started/expo-router` for v4.1:

- Install nativewind@^4.1.x and tailwindcss@^3.4.x
- `apps/product/tailwind.config.ts` extends design-tokens preset
- `apps/product/global.css` (NativeWind processed)
- `apps/product/babel.config.js` adds nativewind/babel preset
- `apps/product/metro.config.js` wraps with `withNativeWind`
- Verify NativeWind classes work on web AND native

### Step 7: Product App ThemeProvider (~2 hours)

- `apps/product/lib/theme/ThemeProvider.tsx`
- Context with `theme` ('dark' | 'light' | 'system') and `accent` (preset key | custom hex)
- Subscribes to system color scheme via `useColorScheme()` from react-native
- Persists to `react-native-mmkv` (install if not yet)
- Wraps app in `_layout.tsx`
- Provides `useTheme()` hook returning current colors

### Step 8: Test page in both apps (~1 hour)

- `apps/marketing/app/_test/tokens/page.tsx`
- `apps/product/app/_test/tokens.tsx` (Expo Router)
- Each shows: theme name, accent name, swatches (bg-base, bg-raised, accent, all status), buttons to toggle
- Used for visual verification

### Step 9: Contrast tests (~1 hour)

- `packages/design-tokens/src/contrast.test.ts`
- For every text-on-background pair, validate contrast ≥ 4.5:1
- Vitest setup
- CI gate later

### Step 10: Typecheck, lint, commit (~30 min)

## Files Created/Modified

**Created:**

- `packages/design-tokens/package.json`
- `packages/design-tokens/src/index.ts`
- `packages/design-tokens/src/tokens.ts`
- `packages/design-tokens/src/themes.ts`
- `packages/design-tokens/src/accents.ts`
- `packages/design-tokens/src/tailwind-preset.ts`
- `packages/design-tokens/src/contrast.test.ts`
- `packages/design-tokens/tsconfig.json`
- `apps/product/tailwind.config.ts`
- `apps/product/global.css`
- `apps/product/babel.config.js` (modified)
- `apps/product/metro.config.js` (modified)
- `apps/product/lib/theme/ThemeProvider.tsx`
- `apps/product/lib/theme/useTheme.ts`
- `apps/marketing/app/_test/tokens/page.tsx`
- `apps/product/app/_test/tokens.tsx`

**Modified:**

- `apps/marketing/tailwind.config.ts`
- `apps/marketing/app/globals.css`
- `apps/marketing/app/layout.tsx`
- `apps/product/app/_layout.tsx`
- root `package.json` (vitest as devDep)

## Common Pitfalls

**1. NativeWind v5 confusion** — DO NOT install v5. Verify `package.json` shows `nativewind@^4.1.x`. v5 is pre-release.

**2. Tailwind v4 confusion** — DO NOT install v4. Verify `tailwindcss@^3.4.x`.

**3. NativeWind metro config** — must wrap with `withNativeWind(config, { input: './global.css' })`. Easy to forget.

**4. Color tokens not theme-aware** — components must reference semantic tokens (`bg-base`, `accent`), never raw hex. Validate by grep'ing for `#` in component files (Phase 04+).

**5. data-theme attribute reset on hydration** — Marketing Site Next.js may flash wrong theme on load. Use `next-themes` library to handle.

**6. iOS doesn't update on theme change** — verify `useColorScheme()` from `react-native` is wired to ThemeProvider, and ThemeProvider re-renders dependent children.

## Done When

- All acceptance criteria checked
- Both test pages visually identical for matching theme+accent
- Theme switch in one app doesn't affect other (they're independent — that's correct, but token sources must match)
- Commit pushed: `feat(design-tokens): implement token system + theme provider`
- log.md updated with Phase 02 reflection
- Petja confirms ready for Phase 03

---

**Next:** `phase-03-i18n.md`
