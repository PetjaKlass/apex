# Phase 20 — Knowledge Library + Areas + Projects

> **Stage:** Beta
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 19 complete

## Goal

Implement supporting structures: Areas of Life (Health, Career, Family, etc.), Projects (within Areas), and Knowledge Library (notes, references, attachments). Tag system. Cross-entity search.

## Why Now

Tasks/Habits/Goals all reference these. Users have been creating tasks in nameless projects until now. Time to formalize the organization.

## Prerequisites

- Phase 19 complete
- areas, projects, knowledge_entries, attachments tables exist

## Scope

1. Areas page: life areas (Health, Career, Family, etc.)
2. Areas CRUD (create, rename, color, archive)
3. Projects page with CRUD
4. Project detail view (linked tasks, goals, knowledge)
5. Knowledge Library (notes, references)
6. File attachments (images, PDFs to Supabase Storage)
7. Tag system (custom colors per design system)
8. Cross-entity search (tasks, habits, goals, knowledge)
9. Quick filters by Area / Project / Tag

## Out of Scope

- Public sharing of knowledge (NOT in Apex)
- Knowledge templates marketplace (NOT in Apex)
- Web clipper extension (later, optional)

## Acceptance Criteria

- [ ] Areas page: 8-10 default areas, custom color picker
- [ ] Areas CRUD operations work
- [ ] Projects page with kanban-style status columns
- [ ] Project detail: tabs for Tasks, Goals, Knowledge, Activity
- [ ] Knowledge Library: list + detail view
- [ ] Knowledge entry: title, content (markdown), source URL, tags
- [ ] File attachments: upload, preview, download
- [ ] Tag creation with color from curated palette (12 colors per design system)
- [ ] Search: cross-entity, ranked by relevance
- [ ] Quick filters: by Area, Project, Tag
- [ ] All works offline (PowerSync syncs when back)
- [ ] All animations 60fps
- [ ] Reduced motion respected

## Implementation Plan

1. **Areas page** (~3 hours)
2. **Areas CRUD** (~2 hours)
3. **Projects page** (~3 hours)
4. **Project detail view with tabs** (~3 hours)
5. **Knowledge page** (~2 hours)
6. **Knowledge entry editor** (~2 hours) — markdown
7. **Attachments upload** (~3 hours) — Supabase Storage, with preview
8. **Tag system** (~2 hours) — picker with 12 curated colors
9. **Cross-entity search** (~3 hours) — FTS5 across multiple tables, unified results
10. **Quick filters** (~2 hours)
11. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/areas/index.tsx`
- `apps/product/app/(app)/projects/index.tsx`
- `apps/product/app/(app)/projects/[id].tsx`
- `apps/product/app/(app)/knowledge/index.tsx` (real)
- `apps/product/app/(app)/knowledge/[id].tsx`
- `apps/product/components/areas/AreaCard.tsx`
- `apps/product/components/projects/ProjectCard.tsx`
- `apps/product/components/projects/ProjectKanban.tsx`
- `apps/product/components/knowledge/KnowledgeEditor.tsx`
- `apps/product/components/attachments/AttachmentUpload.tsx`
- `apps/product/components/tags/TagPicker.tsx`
- `apps/product/components/search/GlobalSearch.tsx` (Cmd+K extended)

## Common Pitfalls

**1. Curated tag colors only** — DO NOT add free hex picker. Generates ugly clashing tags. 12 presets only.

**2. Attachment upload size limits** — Supabase Storage has limits per file. 50MB practical max for now.

**3. Search ranking** — relevance ranking via FTS5 BM25. Test with real-world queries.

**4. Project status column drag** — kanban reorder = changing status. Optimistic UI.

**5. Knowledge cross-link** — `[[Other Note]]` syntax? Defer to Stage 3 (Wisdom Library).

**6. Areas vs Tags overlap** — Areas are formal hierarchy (Career, Health). Tags are loose. Don't conflate.

## Done When

- Petja organizes existing tasks into proper Projects/Areas
- Knowledge entries created and searchable
- Cross-search returns sensible results
- Commit: `feat(organization): areas, projects, knowledge, tags, search`

---

**Next:** `phase-21-mobile-native.md` (the big one — App Store submission)
