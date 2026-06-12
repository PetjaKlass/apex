# Phase 14 — Tasks (Full Implementation)

> **Stage:** Beta (first phase of Stage 2)
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 13 complete + Stage 1 retrospective showed Tasks as priority

## Goal

Build complete Task management feature: TaskRow component per spec (the most-clicked component in Apex), Tasks page with all views, all CRUD operations, drag-drop reordering, swipe-to-action on mobile.

## Why Now

Phase 12 used a TaskRow placeholder. Now we replace it with the real thing per `task-row.md` spec. This is the foundation for daily use — Tasks are the most-used feature.

## Prerequisites

- Phase 13 complete, dogfooding showed Tasks as priority
- All foundation components ready
- Database has tasks table

## Scope

1. `<TaskRow>` per `task-row.md` spec — full implementation
2. Tasks page with views: Today, This Week, All, Inbox, By Project
3. Task creation (Quick Add, Full Add)
4. Task editing inline + detail panel
5. Task deletion with undo
6. Subtasks support
7. Recurring tasks
8. Filtering + sorting
9. Drag-and-drop reordering (kanban-style by status)
10. Swipe-to-action on mobile
11. Long-press menu on mobile
12. Optimistic UI everywhere
13. XP rewards (placeholder until Phase 17)

## Out of Scope

- Real XP engine (Phase 17)
- Calendar integration (Phase 28)
- AI Coach suggestions (Phase 24)
- Bulk operations (later phase)

## Acceptance Criteria

- [ ] TaskRow renders all 8+ states (default, hover, completed, overdue, drag-active, etc.)
- [ ] Completion choreography: 8 phases per spec (200ms checkmark + strikethrough + fade + 1.5s pause + slide-out)
- [ ] Strikethrough animation draws left to right (300ms)
- [ ] Mobile haptic on completion (Medium impact)
- [ ] Sound on completion (if enabled): `task-complete.mp3`
- [ ] Task creation: Cmd+N or "+ Task" button
- [ ] Quick Add: title only, fast (sub-second)
- [ ] Full Add: title, description, project, deadline, priority, energy, recurring
- [ ] Detail panel slides in from right (350ms spring)
- [ ] Subtasks: indented, completion percentage shown on parent
- [ ] Recurring tasks: completing one creates next occurrence
- [ ] Drag-drop reordering on web (within list)
- [ ] Drag-drop between status columns (kanban view)
- [ ] Swipe right on mobile → reveal Complete action
- [ ] Swipe left on mobile → reveal Schedule/Delete
- [ ] Long-press on mobile → bottom sheet menu (Edit, Schedule, Move, Mark done, Delete)
- [ ] Filter: by project, area, priority, status, deadline range
- [ ] Sort: deadline, created, priority, energy
- [ ] Search across all tasks
- [ ] Undo delete: toast with "Undo" action (10 second window)
- [ ] Optimistic UI: completion is instant, errors revert with toast
- [ ] FlashList for performance (10x flatlist)
- [ ] All accessibility: keyboard nav (Tab + arrows + Space + Enter)
- [ ] Reduced motion: simplified animations
- [ ] Tests pass

## Implementation Plan

1. **TaskRow component** (~10 hours) — full spec, 8 states, all interactions
2. **Tasks page layout** (~3 hours) — header with view tabs + filter bar
3. **Views: Today, Week, All, Inbox** (~3 hours) — different queries, same layout
4. **Quick Add** (~2 hours) — minimal modal, title only, smart defaults
5. **Full Add modal** (~3 hours) — all fields, validation
6. **Task detail panel** (~3 hours) — slide-in, all metadata, edit inline
7. **Subtasks** (~2 hours) — nested rendering
8. **Recurring logic** (~2 hours) — on complete, create next based on rrule
9. **Drag-drop web** (~3 hours) — `@dnd-kit/core` or React Native equivalent
10. **Swipe gestures mobile** (~3 hours) — react-native-gesture-handler
11. **Long-press menu** (~1 hour)
12. **Filter + sort + search** (~3 hours)
13. **Undo delete** (~1 hour)
14. **XP placeholder** (~30 min) — log XP event, real engine in Phase 17
15. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/product/components/tasks/TaskRow.tsx` (REAL implementation, replacing Phase 12 placeholder)
- `apps/product/components/tasks/TaskQuickAdd.tsx`
- `apps/product/components/tasks/TaskFullAddModal.tsx`
- `apps/product/components/tasks/TaskDetailPanel.tsx`
- `apps/product/components/tasks/TaskFilters.tsx`
- `apps/product/components/tasks/TaskKanbanBoard.tsx`
- `apps/product/lib/tasks/queries.ts` (PowerSync queries)
- `apps/product/lib/tasks/recurring.ts` (rrule logic)
- `apps/product/app/(app)/tasks/index.tsx` (real page)
- `apps/product/app/(app)/tasks/[id].tsx` (detail route)

## Common Pitfalls

**1. TaskRow re-renders** — used in long lists. React.memo with proper comparison function. Test with 200+ tasks.

**2. Optimistic UI race conditions** — user marks task complete, then unmarks before sync, then sync completes wrong. Use proper state machine.

**3. Recurring task math** — DST + timezone edge cases. Use `rrule.js` library.

**4. Drag-drop on touch devices** — different gesture model than mouse. Long-press to initiate.

**5. Swipe gesture conflicts with scroll** — gesture-handler config matters. Vertical scroll, horizontal swipe.

**6. FlashList key extraction** — must be stable. Use `task.id` (uuid).

**7. Subtasks UI complexity** — keep it simple. No multi-level nesting.

**8. Search performance** — local search via SQLite FTS5 (PowerSync supports). Don't query server.

## Done When

- TaskRow visually + behaviorally matches spec
- Petja uses Tasks daily and reports it feels right
- All views functional
- Drag-drop works smoothly
- Mobile gestures feel native
- Commit: `feat(tasks): full implementation per spec`

---

**Next:** `phase-15-habits.md`
