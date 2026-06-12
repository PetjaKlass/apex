# Phase 30 — Premium Polish: Custom Cursor + Mythic Mode

> **Stage:** Launch+
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 29 complete

## Goal

Premium touches that get screenshots and X mentions: custom cursor on web, Mythic mode for high-momentum users (>2000), particle effects, achievement unlock animations, final design polish pass.

## Why Now

By Stage 3 we have customers. Polish is what creates "wow, screenshot-worthy" moments. These small details drive organic word-of-mouth.

## Prerequisites

- Phase 29 complete
- Petja or user community has reached >2000 momentum (test data for Mythic)

## Scope

1. Custom cursor on web (per design-system.md spec)
2. Toggle in Settings (default off — respect user preferences)
3. Mythic mode for MomentumOrb (>2000 momentum)
4. Particle effects for high-momentum users (Canvas-based)
5. Achievement unlock animations (badges from Phase 17)
6. Theme picker enhancements (preview previews)
7. Final design polish pass on all pages

## Out of Scope

- Custom cursor on native (not technically possible)
- VR/AR (NOT in Apex scope)

## Acceptance Criteria

### Custom cursor (web only)

- [ ] Custom SVG cursor on web app
- [ ] 4 variants: default, link, button, text
- [ ] Cursor changes contextually
- [ ] Hover trail effect (optional, subtle)
- [ ] Toggle in Settings (default off)
- [ ] Falls back to system cursor on touch devices
- [ ] Doesn't break accessibility (hidden when keyboard nav active)

### Mythic mode

- [ ] Activates at momentum >2000
- [ ] MomentumOrb gets gold gradient
- [ ] Subtle continuous sparkle effects
- [ ] Subtle audio cue on first activation (one-time)
- [ ] Permanent visual change once unlocked
- [ ] Achievement: "Mythic" badge

### Particle effects

- [ ] Canvas-based (not DOM elements)
- [ ] Active when momentum >800
- [ ] 3-5 particles, slow drift
- [ ] Disabled in reduced motion
- [ ] Disabled on low-power mode (iOS)

### Achievement animations

- [ ] Badge unlock: full-screen overlay, 1500ms ceremony
- [ ] Includes badge icon + title + description
- [ ] Sound (optional, subtle) and haptic on mobile
- [ ] One-time animation per badge

### Theme picker

- [ ] Live preview of theme + accent before applying
- [ ] 5 preset accents + custom hex picker
- [ ] Smooth transitions on apply

### Polish pass

- [ ] Audit every page for: typography consistency, spacing, color usage
- [ ] Fix small inconsistencies
- [ ] Improve empty states
- [ ] Add subtle micro-interactions where missing

## Implementation Plan

1. **Custom cursor SVG + CSS** (~3 hours) — 4 variants, contextual switching
2. **Cursor toggle Settings** (~1 hour)
3. **Mythic mode logic + visuals** (~3 hours)
4. **Particle effects** (~3 hours) — Canvas/Skia
5. **Achievement unlock overlay** (~3 hours)
6. **Theme picker enhancements** (~2 hours)
7. **Polish pass** (~3 hours) — audit + fixes
8. **Tests + commit** (~1 hour)

## Files Created/Modified

**Created:**

- `apps/product/components/cursor/CustomCursor.tsx`
- `apps/product/components/cursor/cursors/` (SVG variants)
- `apps/product/components/dashboard/MomentumOrb.tsx` (Mythic variant added)
- `apps/product/components/dashboard/MomentumParticles.tsx` (Canvas-based)
- `apps/product/components/gamification/BadgeUnlockOverlay.tsx`
- `apps/product/components/settings/ThemeAccentPicker.tsx` (enhanced)

**Modified:**

- Various pages for polish pass (small tweaks, not major changes)

## Common Pitfalls

**1. Custom cursor accessibility** — must NOT replace system cursor for keyboard users or screen readers. Hide when not using mouse.

**2. Particle performance** — Canvas with 60fps loop costs CPU. Test on low-end devices, disable if FPS drops.

**3. Mythic mode unlock timing** — "first activation" means: was below 2000, now above 2000. Track threshold crossing.

**4. Polish pass scope creep** — easy to spend a week. Time-box to 3 hours, fix highest-impact issues only.

**5. Theme transitions** — switching theme must be smooth (no flash of wrong colors). Use CSS transitions + RAF for tokens.

## Done When

- Petja's screen with Mythic mode is screenshot-worthy
- Custom cursor toggle works
- 5+ badges unlock with proper ceremony
- Polish pass complete
- Commit: `feat(polish): mythic mode + custom cursor + achievements`

---

**Next:** `phase-31-affiliate-program.md`
