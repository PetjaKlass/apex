# Phase 26 — The Letter (Yearly Time Capsule)

> **Stage:** Launch+
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 25 complete

## Goal

Annual letter to future self — a Tim Ferriss-inspired ritual. Long-form letter writing with prompts, archive, and one-year-later compare experience.

## Why Now

Score Card (Phase 25) handles past reflection. The Letter handles future. Together: identity-first product completes its loop.

## Prerequisites

- Phase 25 complete
- Annual prompt scheduling (around year-end or user's birthday)

## Scope

1. The Letter page
2. Annual prompt: triggered around Dec 25-31 OR user's birthday
3. Long-form letter writing experience (focused, distraction-free)
4. Past letters archive
5. Compare past letter to current state (one year later overlay)
6. Email reminder for annual letter
7. Privacy: letters never shared, fully private

## Out of Scope

- Multi-recipient letters (just self-letters)
- Public sharing (private only)
- AI-generated letter suggestions (NO — this must be authentic)

## Acceptance Criteria

- [ ] The Letter page route
- [ ] Letter writing UI: full-screen, distraction-free, prompts available
- [ ] Annual letter prompt: "Write to yourself one year from today"
- [ ] Suggested questions: What did this year teach you? What are you proud of? What do you hope for next year? What scares you? What anchors you?
- [ ] Save draft (auto-save), publish/seal
- [ ] Past letters archive with year + opening line preview
- [ ] One-year-later compare: side-by-side "what you wrote" + "what came true"
- [ ] Email reminder: 1 week before annual prompt window
- [ ] Privacy: letters in user_private bucket, not shared in Duo
- [ ] Reduced motion respected

## Implementation Plan

1. **The Letter route + page** (~2 hours)
2. **Letter editor** (~4 hours) — full-screen, distraction-free, prompt panel collapsible
3. **Annual prompt scheduling** (~2 hours) — triggered around year-end or birthday (config in Settings)
4. **Past letters archive** (~3 hours) — list with year + preview
5. **Side-by-side compare** (~3 hours) — "Last year you wrote..." + "Now reflecting one year later..."
6. **Email reminder** (~2 hours) — Resend, scheduled
7. **Letters table + queries** (~2 hours)
8. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/letters/index.tsx`
- `apps/product/app/(app)/letters/[id].tsx`
- `apps/product/app/(app)/letters/new.tsx`
- `apps/product/components/letters/LetterEditor.tsx`
- `apps/product/components/letters/LetterArchiveCard.tsx`
- `apps/product/components/letters/CompareView.tsx`
- `apps/product/lib/letters/queries.ts`
- `supabase/migrations/0040_letters.sql`
- `supabase/functions/letter-reminder-cron/index.ts`

## Common Pitfalls

**1. Letter is sacred** — UI must feel reverent, not utilitarian. Slower animations, generous whitespace.

**2. Annual prompt timing** — give 14-day window to write (Dec 24 - Jan 7). Don't pressure.

**3. Birthday detection** — user enters birthday in Settings. Use month + day, ignore year.

**4. Compare view emotionally heavy** — when reading old letters, users may feel emotion. Keep UI calm.

**5. Letter export** — should users be able to export? Yes, PDF download. Their private content.

**6. Privacy MUST be airtight** — letters never sync to other users. Test cross-user access.

## Done When

- Petja writes his first annual letter
- Past letters display correctly
- Email reminder fires at correct time
- Privacy verified
- Commit: `feat(letters): annual letter with past archive`

---

**Next:** `phase-27-wisdom-library.md`
