# Phase 18 — Vision & Goals

> **Stage:** Beta
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 17 complete

## Goal

Complete Vision and Goal management features. Implement VisionCard component per spec. Build vision creation, goal hierarchy (Vision → Goal → Project → Task), Conviction Score, image upload to Supabase Storage.

## Why Now

Onboarding (Phase 11) created first Vision/Goal but minimally. Now we make these full features. Vision is core to Apex's differentiation ("Life OS, not just task manager").

## Prerequisites

- Phase 17 complete
- visions, goals, key_results tables exist
- Supabase Storage configured for image uploads

## Scope

1. `<VisionCard>` per spec — full implementation
2. Vision page: 1/3/5-year horizons + custom
3. Vision creation with image upload (Supabase Storage)
4. Conviction Score (0-100) with reassessment flow
5. Future-self statement editor
6. Goals page
7. Goal creation linked to Vision
8. Key Results (OKR-style sub-goals)
9. Quarterly goal cycles
10. Vision → Goal → Project → Task hierarchy navigation
11. Vision achievement celebration (rare, big moment)
12. Pause/Resume vision flow

## Out of Scope

- AI Coach vision recommendations (Phase 24)
- Vision template library (later)
- Public vision sharing (NOT in Apex)

## Acceptance Criteria

- [ ] VisionCard renders all 6 variants (default, compact, paused, achieved, empty, editing)
- [ ] Image upload works: file picker, 16:9 crop, upload to Supabase Storage, blur hash generation
- [ ] Conviction Meter uses gradient (red→gold) per spec
- [ ] Conviction reassessment flow (slider + reflection)
- [ ] Vision creation with all fields
- [ ] Vision page: cards in responsive grid
- [ ] Goals page: kanban-style or list (user choice)
- [ ] Goal creation linked to Vision (dropdown)
- [ ] Key Results sub-form (1-3 KRs per goal)
- [ ] Quarterly cycles: goals can be assigned to Q1/Q2/Q3/Q4 of year
- [ ] Hierarchy: clicking goal shows tasks under projects under that goal
- [ ] Vision achievement: trophy icon, celebratory tint, date achieved
- [ ] Pause/Resume vision: state transitions correctly
- [ ] All animations 60fps
- [ ] Image upload progress indicator
- [ ] Image fallback when no upload (line-art placeholder)
- [ ] Reduced motion respected
- [ ] Accessibility: image alt text uses vision title

## Implementation Plan

1. **VisionCard component** (~10 hours) — full spec, all 6 variants
2. **Image upload component** (~5 hours) — file picker (expo-document-picker), crop tool, Supabase Storage upload, blur hash via blurhash library
3. **Conviction Meter** (~2 hours) — gradient progress per spec
4. **Conviction reassessment** (~2 hours) — modal with slider + textarea
5. **Vision creation flow** (~3 hours) — multi-step or single page
6. **Vision page** (~2 hours) — responsive grid
7. **Goal CRUD** (~3 hours)
8. **Key Results** (~2 hours) — sub-form with add/remove
9. **Quarterly cycles** (~2 hours) — UI for assigning goals to quarters
10. **Hierarchy navigation** (~2 hours) — drill from Vision → Goal → Project → Task
11. **Achievement flow** (~2 hours) — celebration + DB state change
12. **Tests + commit** (~3 hours)

## Files Created/Modified

**Created:**

- `apps/product/components/vision/VisionCard.tsx`
- `apps/product/components/vision/VisionImageUpload.tsx`
- `apps/product/components/vision/ConvictionMeter.tsx`
- `apps/product/components/vision/ConvictionReassessment.tsx`
- `apps/product/components/vision/VisionCreateFlow.tsx`
- `apps/product/components/goals/GoalCard.tsx`
- `apps/product/components/goals/GoalCreateModal.tsx`
- `apps/product/components/goals/KeyResultsEditor.tsx`
- `apps/product/lib/storage/imageUpload.ts`
- `apps/product/lib/storage/blurHash.ts`
- `apps/product/app/(app)/vision/index.tsx` (real page)
- `apps/product/app/(app)/vision/[id].tsx`
- `apps/product/app/(app)/goals/index.tsx` (real page)

## Common Pitfalls

**1. Image upload size** — limit to 10MB, auto-resize to max 2400×1350. Show error if too large.

**2. Blur hash generation** — done client-side via `blurhash` lib. Sub-100ms. Store as string in DB.

**3. Image security** — Supabase Storage URLs are signed/public depending on bucket. Use signed URLs for private workspace assets.

**4. 16:9 aspect crop** — use `react-native-image-crop-picker` or similar. iOS + Android compatibility.

**5. Conviction gradient render** — 0-100 maps to gradient stops. Smooth transition.

**6. Goal cycles vs deadlines** — goals can have both. Quarterly cycle is bucket; deadline is precise.

**7. Vision achievement is rare** — once per multiple years. Don't optimize for high frequency.

**8. Empty vision state** — line-art mountain illustration. Keep simple.

## Done When

- Petja sets a real vision with personal image
- Conviction Score updates correctly
- Goals link to vision and show progress
- Hierarchy navigation works
- Commit: `feat(vision,goals): full implementation with image upload`

---

**Next:** `phase-19-rituals-journal.md`
