# Phase 25 — Score Card (Yearly Reflection)

> **Stage:** Launch+
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 24 complete

## Goal

Build annual / quarterly performance summary for users — Apex's "Year in Review" feature. Aggregated stats, beautiful visualizations, shareable images. Tim Ferriss-inspired Past Year Review structure.

## Why Now

Users have been using Apex for months by now. They have rich data. Score Card surfaces it in a meaningful way — creates retention moments and shareable marketing.

## Prerequisites

- Phase 24 complete
- Users have ≥3 months of data for meaningful summaries

## Scope

1. Score Card page accessible from Settings or Dashboard
2. Aggregated stats: tasks completed, habits maintained, focus hours, goals achieved
3. Visualizations: charts (Recharts), heatmaps, bar comparisons
4. Year-end summary (Spotify Wrapped style for productivity)
5. Quarterly summaries
6. Shareable image (premium feature) — generates PNG with stats
7. Export to PDF
8. Compare year-over-year (when 2+ years of data)

## Out of Scope

- Public Score Card sharing on the web (just shareable PNG users post themselves)
- Real-time live Score Card (only year-end + quarterly)

## Acceptance Criteria

- [ ] Score Card page route + navigation
- [ ] Annual view: full year breakdown with key stats
- [ ] Quarterly view: 90-day breakdown
- [ ] Stats include: tasks completed, habits maintained (longest streak), focus hours total, goals achieved, vision progress, journal entries, momentum peak
- [ ] Visualizations: bar chart by month, heatmap calendar, comparison year-over-year
- [ ] Shareable PNG generation: 1080×1920 (Instagram Story format)
- [ ] PDF export
- [ ] All copy in EN + DE
- [ ] Animations smooth (Recharts default transitions)
- [ ] Accessibility: data tables as alternative to charts

## Implementation Plan

1. **Score Card route** (~1 hour)
2. **Stats aggregation queries** (~4 hours) — across all entities (tasks, habits, focus_sessions, etc.)
3. **Visualizations with Recharts** (~5 hours) — bar charts, heatmap, comparison
4. **Annual view layout** (~3 hours) — hero stats + sections
5. **Quarterly view** (~2 hours) — same structure, narrower window
6. **Shareable PNG** (~3 hours) — html-to-image or canvas, with watermark
7. **PDF export** (~2 hours) — react-pdf or HTML-to-PDF
8. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/score-card/index.tsx`
- `apps/product/app/(app)/score-card/[year]/page.tsx`
- `apps/product/components/score-card/ScoreCardHero.tsx`
- `apps/product/components/score-card/StatsSection.tsx`
- `apps/product/components/score-card/MonthlyBarChart.tsx`
- `apps/product/components/score-card/HabitHeatmap.tsx`
- `apps/product/components/score-card/ShareImage.tsx`
- `apps/product/lib/score-card/aggregations.ts`
- `apps/product/lib/score-card/exportPng.ts`
- `apps/product/lib/score-card/exportPdf.ts`

## Common Pitfalls

**1. Aggregation performance** — querying full year of data can be slow. Pre-aggregate via materialized view or scheduled job.

**2. Year boundary confusion** — what's "this year"? User's local timezone, calendar year (Jan-Dec).

**3. Empty year handling** — user joined in October, "this year" is sparse. Show what exists, no shaming.

**4. PNG generation library compatibility** — `html-to-image` works on web, native needs different approach (`react-native-view-shot`).

**5. PDF export complexity** — keep simple: hero + key stats + 2-3 charts. Don't try fancy layouts.

**6. Sharing watermark** — include subtle "apex.com" so shared images bring traffic.

## Done When

- Petja generates Score Card for his year of dogfooding
- Charts render correctly
- PNG export works on web + mobile
- PDF export works
- Commit: `feat(score-card): annual + quarterly performance summaries`

---

**Next:** `phase-26-the-letter.md`
