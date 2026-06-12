# Phase 27 — Wisdom Library

> **Stage:** Launch+
> **Size:** S (1 day, ~6-8 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 26 complete

## Goal

Curated library of quotes, principles, and books that align with Apex's philosophy. Daily quote on Dashboard, save favorites, suggested reading list.

## Why Now

Small but meaningful feature. Adds substance to Apex (vs just a productivity tool). Petja can curate based on his reading.

## Prerequisites

- Phase 26 complete
- Petja has 100+ curated quotes/principles ready (his own collection)

## Scope

1. Wisdom Library section in app
2. Daily quote on Dashboard (rotates)
3. Curated by Petja (initial 100 quotes/principles)
4. User can save favorites
5. Source attribution (book, author)
6. Suggested reading list (10-20 books)
7. Categorization: stoicism, philosophy, productivity, identity, leadership

## Out of Scope

- User-submitted quotes (too noisy)
- Books with affiliate links (later, Phase 31)
- Quote sharing on social (defer)

## Acceptance Criteria

- [ ] Wisdom Library page (`/library` or under `/knowledge`)
- [ ] 100+ quotes seeded in DB
- [ ] Daily quote on Dashboard (deterministic rotation)
- [ ] User can favorite quotes
- [ ] Favorites view in Wisdom Library
- [ ] Source attribution clickable (links to book or article)
- [ ] Suggested reading list with brief Petja commentary on each book
- [ ] Search across quotes
- [ ] Categories filter
- [ ] All in EN + DE (Petja translates as needed)

## Implementation Plan

1. **wisdom_quotes table** (~30 min) — migration
2. **Seed data** (~2 hours, mostly Petja's work) — 100 quotes from his collection
3. **Wisdom Library page** (~2 hours)
4. **Daily quote on Dashboard** (~1 hour) — deterministic rotation by date
5. **Favorites feature** (~1 hour) — wisdom_favorites table
6. **Suggested reading list** (~1 hour)
7. **Search + filter** (~1 hour)
8. **Tests + commit** (~30 min)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/library/index.tsx`
- `apps/product/components/library/QuoteCard.tsx`
- `apps/product/components/library/DailyQuoteWidget.tsx`
- `supabase/migrations/0050_wisdom_library.sql`
- `supabase/seed/wisdom_quotes.sql` (100+ quotes)
- `apps/product/lib/library/queries.ts`

**Modified:**

- `apps/product/app/(app)/dashboard/index.tsx` (add daily quote widget)

## Common Pitfalls

**1. Translation effort** — translating 100 quotes is a lot. Start with EN, translate gradually.

**2. Attribution accuracy** — verify every quote source. Don't perpetuate misattributed quotes.

**3. Daily quote determinism** — same quote per day for all users (community feel) OR per-user random? Decide UX.

**4. Categorization** — keep categories few (5-7 max). Otherwise filter is noisy.

## Done When

- Daily quote shows on Dashboard
- 100+ quotes available
- Favorites work
- Reading list visible
- Commit: `feat(library): wisdom quotes and reading list`

---

**Next:** `phase-28-calendar-integration.md`
