# Phase 19 — Morning & Evening Rituals + Journal

> **Stage:** Beta
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 18 complete

## Goal

Build the daily ritual flows (Morning, Evening) and CEO Review (weekly). Plus full Journal feature with markdown support, auto-save, search, and energy/mood logging.

## Why Now

Tasks/Habits/Focus = doing. Rituals/Journal = reflecting. Together they complete the daily loop. Reflection is what makes Apex feel like a Life OS, not a productivity tool.

## Prerequisites

- Phase 18 complete
- morning_rituals, evening_rituals, ceo_reviews, journal_entries, energy_logs tables exist

## Scope

1. Morning Ritual flow (full-screen, identity-first)
2. Evening Ritual flow
3. CEO Review (weekly, configurable day)
4. Journal page (long-form reflection)
5. Markdown support in journal
6. Auto-save with subtle "Saving…" indicator
7. Journal entry detail view
8. Journal search (FTS5 via SQLite)
9. Energy slider component (1-5, with haptic)
10. Mood logging
11. Daily prompt rotation
12. Journal entry templates (optional, defer if time)

## Out of Scope

- Voice input for journal (later)
- AI Coach journal review (Phase 24)
- Journal export (later)
- Photos in journal (defer to Stage 3)

## Acceptance Criteria

- [ ] Morning Ritual: full-screen, single question per screen, sunrise gradient
- [ ] Evening Ritual: full-screen, twilight gradient
- [ ] CEO Review: full-screen, multi-step (7 questions), progress bar
- [ ] Energy slider: 1-5 scale, haptic per tick (mobile)
- [ ] Mood logging: emoji picker
- [ ] Ritual completion: XP awarded, state saved
- [ ] Skip with confirmation modal
- [ ] Journal page: list of entries by date
- [ ] Journal entry: markdown editor (Textarea-based)
- [ ] Auto-save: 1s debounce after typing, "Saved 3s ago" indicator
- [ ] Journal entry detail: rendered markdown
- [ ] Journal search: full-text via SQLite FTS5
- [ ] Daily prompt: rotates through 30+ prompts
- [ ] Markdown rendering: headers, bold, italic, lists, links, quotes
- [ ] Reduced motion: full-screen entrances simplified
- [ ] Accessibility: full keyboard navigation through ritual flows
- [ ] All copy in EN + DE
- [ ] All animations 60fps

## Implementation Plan

1. **Ritual layout** (~3 hours) — full-screen mode, gradient backgrounds, step navigation
2. **Morning Ritual flow** (~4 hours) — 5-7 questions per spec
3. **Evening Ritual flow** (~3 hours) — similar structure
4. **CEO Review flow** (~4 hours) — weekly, 7 questions, progress bar
5. **Energy slider component** (~2 hours) — 1-5, haptic per tick
6. **Mood emoji picker** (~1 hour)
7. **Journal page** (~3 hours)
8. **Markdown editor** (~3 hours) — Textarea + markdown render preview
9. **Auto-save** (~2 hours) — debounce, save indicator
10. **Journal search** (~2 hours) — FTS5 setup, search UI
11. **Daily prompts** (~2 hours) — 30+ prompts in code, rotation logic
12. **Tests + commit** (~3 hours)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/rituals/morning.tsx`
- `apps/product/app/(app)/rituals/evening.tsx`
- `apps/product/app/(app)/rituals/weekly-review.tsx`
- `apps/product/components/rituals/RitualLayout.tsx`
- `apps/product/components/rituals/RitualStep.tsx`
- `apps/product/components/inputs/EnergySlider.tsx`
- `apps/product/components/inputs/MoodPicker.tsx`
- `apps/product/components/journal/JournalEditor.tsx`
- `apps/product/components/journal/MarkdownRenderer.tsx`
- `apps/product/lib/journal/autosave.ts`
- `apps/product/lib/journal/prompts.ts` (30+ prompts)
- `apps/product/app/(app)/journal/index.tsx` (real page)
- `apps/product/app/(app)/journal/[id].tsx`

## Common Pitfalls

**1. Markdown rendering** — use `react-native-markdown-display` or similar. Test all common patterns.

**2. Auto-save race conditions** — user types → debounce 1s → save → another type → debounce. Cancel previous save if mid-flight.

**3. FTS5 setup** — SQLite FTS5 requires virtual table. Configure via PowerSync schema.

**4. Ritual interruption** — if user closes mid-ritual, save partial state, allow resume.

**5. Cross-day journal** — what counts as "today's journal"? User's local timezone, midnight cutoff.

**6. Energy slider haptic spam** — debounce or limit haptic to threshold crossings, not every pixel.

**7. Daily prompt rotation** — deterministic per day (same prompt all day). Hash from date.

**8. CEO Review timing** — only available on Sunday (or user-configured day). Block other days with helpful message.

## Done When

- Petja completes a real Morning Ritual
- Petja writes 3+ journal entries
- Auto-save works invisibly
- Search finds entries
- CEO Review on Sunday feels meaningful
- Commit: `feat(rituals,journal): daily reflection flows + journal`

---

**Next:** `phase-20-knowledge-areas-projects.md`
