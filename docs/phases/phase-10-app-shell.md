# Phase 10 — App Shell & Navigation (Product App)

> **Stage:** Alpha
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 09 complete

## Goal

Build the Product App's structural shell — sidebar, topbar, page routing, layouts. Create empty page placeholders for each major route. Real features fill these placeholders in subsequent phases.

## Why Now

After Phase 09, we have data flowing. Now we need a place for users to see it. The shell defines navigation patterns that all subsequent feature phases (12-20) build into.

## Prerequisites

- Phase 09 complete (data layer working)
- 15 foundation components available

## Scope

1. App Shell layout: Sidebar (left) + Topbar (top) + main content
2. Sidebar: nav items for Dashboard, Tasks, Habits, Goals, Vision, Journal, Knowledge, Settings
3. Topbar: workspace switcher, notification bell, profile menu
4. Expo Router setup with proper layout grouping
5. Page transitions per `design-system.md` Section 12
6. Sidebar collapse on small screens (drawer pattern on mobile)
7. Empty page placeholders for each route
8. 404 catch-all
9. Logout from profile menu

## Out of Scope

- Real content for each page (Phases 12-20)
- Notification panel content (Stage 2)
- Workspace creation flow (Phase 11 onboarding handles)
- Settings actual options (Phase 11 + later)
- Command palette (Phase 12 dashboard)

## Acceptance Criteria

- [ ] App shell renders on all viewport sizes (mobile portrait, tablet, desktop)
- [ ] Sidebar visible on desktop (≥1024px)
- [ ] Sidebar becomes drawer on mobile (<1024px) — slide in from left
- [ ] Topbar visible on all sizes
- [ ] All 8 nav items render with correct icons (Lucide)
- [ ] Active nav item highlighted (accent color)
- [ ] Click nav item → navigates to placeholder page
- [ ] Page transitions animate per design system (lateral slide for siblings)
- [ ] Workspace switcher works (shows current, allows switching)
- [ ] Profile menu shows user name + logout option
- [ ] Logout works (clears session, redirects to Marketing sign-in)
- [ ] Notification bell badge shows count (placeholder 0 for now)
- [ ] 404 page renders when route doesn't exist
- [ ] All accessibility: keyboard nav, screen readers, focus rings
- [ ] Reduced motion respected (no slide animations)
- [ ] `pnpm typecheck` + `pnpm lint` pass

## Implementation Plan

1. **Layout grouping** (~2 hours) — `app/(app)/_layout.tsx` for authenticated routes
2. **Sidebar component** (~4 hours) — collapsible, responsive, theme-aware
3. **Topbar component** (~3 hours) — sticky, workspace switcher, notification bell, profile menu
4. **Nav items + routing** (~2 hours) — 8 items, file-based routes
5. **Page transitions** (~2 hours) — Expo Router screenOptions with custom animations
6. **Mobile drawer pattern** (~2 hours) — react-native-drawer-layout or custom
7. **Placeholder pages** (~2 hours) — each with title + "Coming in Phase X"
8. **Profile menu + logout** (~1 hour)
9. **404 page** (~30 min)
10. **Accessibility audit + fixes** (~2 hours)
11. **Polish + commit** (~1 hour)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/_layout.tsx`
- `apps/product/app/(app)/dashboard/index.tsx` (placeholder)
- `apps/product/app/(app)/tasks/index.tsx` (placeholder)
- `apps/product/app/(app)/habits/index.tsx` (placeholder)
- `apps/product/app/(app)/goals/index.tsx` (placeholder)
- `apps/product/app/(app)/vision/index.tsx` (placeholder)
- `apps/product/app/(app)/journal/index.tsx` (placeholder)
- `apps/product/app/(app)/knowledge/index.tsx` (placeholder)
- `apps/product/app/(app)/settings/index.tsx` (placeholder)
- `apps/product/app/+not-found.tsx`
- `apps/product/components/shell/Sidebar.tsx`
- `apps/product/components/shell/Topbar.tsx`
- `apps/product/components/shell/NavItem.tsx`
- `apps/product/components/shell/WorkspaceSwitcher.tsx`
- `apps/product/components/shell/ProfileMenu.tsx`
- `apps/product/components/shell/MobileDrawer.tsx`

## Common Pitfalls

**1. Expo Router layout grouping** — `(app)` is a layout group, not a route segment. Easy to confuse.

**2. Sidebar collapse breakpoint** — 1024px is the design choice. Below that, it must be a drawer (sheet pattern).

**3. Active nav item** — use `usePathname()` from expo-router. Simple comparison.

**4. Sidebar scroll on long content** — sidebar nav must scroll independently from main content if needed.

**5. Topbar sticky on mobile** — verify it doesn't jump when keyboard appears.

**6. Logout race condition** — clear session, wait for confirmation, THEN navigate. Otherwise user briefly sees authenticated state with cleared data.

**7. Workspace switcher state** — current workspace must persist across reloads. Store in mmkv.

## Done When

- All routes navigate correctly
- Mobile drawer works smoothly
- Page transitions feel polished
- Logout works cleanly
- Petja navigates the empty shell and confirms it feels right
- Commit: `feat(product): app shell with sidebar + topbar + routing`

---

**Next:** `phase-11-onboarding.md`
