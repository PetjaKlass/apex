# Phase 09 — Database Schema + PowerSync Setup

> 🛑 **SUPERSEDED — NICHT NACH DIESER DATEI ARBEITEN.**
> Die maßgebliche, ausgearbeitete Version ist **`phase-09-EXPANDED.md`**. Diese Stub-Datei
> enthält veraltete und teils sicherheitskritisch falsche Details (u.a. „service role key für
> PowerSync" statt dedizierter `powersync_role`, alte `token_parameters`-Syntax). Sie bleibt nur
> als historischer Kontext erhalten.

> **Stage:** Alpha
> **Size:** XL (1-2 weeks, ~50-80 hours)
> **Status:** SUPERSEDED by phase-09-EXPANDED.md
> **Dependencies:** Phase 08 complete

⚠️ **EXPAND BEFORE STARTING:** This is the most complex phase in Stage 1. Before executing, return to this Claude conversation (or a new chat) to expand this phase into greater detail with current PowerSync docs. The vendor's API may have evolved.

## Goal

Implement the complete data model from `docs/data-model.md`. Set up PowerSync between Supabase Postgres and local SQLite on every client. Verify offline-first works end-to-end. Test data isolation between workspaces.

## Why Now

Auth (Phase 08) gave us users + workspaces. Now we add: tasks, habits, goals, projects, journal, knowledge — everything the user creates. PowerSync makes this work offline-first.

## Prerequisites

- Phase 08 complete (auth + initial RLS works)
- PowerSync account created (EU region)
- PowerSync DPA signed
- AVV with Supabase signed (Phase 08 gate)
- Familiar with `docs/data-model.md` (read fully again)
- Familiar with PowerSync sync rules concept (re-read PowerSync docs)

## Scope

1. All tables from `data-model.md` migrated
2. All RLS policies (workspace-scoped + user-scoped)
3. PowerSync Service connected to Supabase
4. Sync rules YAML written + tested per `data-model.md`
5. PowerSync client SDK in Product App
6. Local SQLite hydration on app start
7. First successful sync cycle (write on web, observe on mobile)
8. Bucket isolation tested (security critical)
9. Conflict resolution tested (offline edits, reconnect)
10. Database backups configured
11. Sync rules code review checklist documented

## Out of Scope

- UI for the data (placeholder Tasks page, etc.) — actual feature UIs come Phase 14+
- Subscription/billing data (Phase 22)
- AI Coach data (Phase 24)
- Calendar integration tables (Phase 28)

## Acceptance Criteria

### Database

- [ ] All ~30 tables from `data-model.md` created via migrations
- [ ] All RLS policies pass adversarial tests (User A cannot read Workspace B)
- [ ] All foreign keys + indices defined
- [ ] All `updated_at` triggers in place
- [ ] Generated TS types include all tables

### PowerSync

- [ ] PowerSync Service deployed (cloud or local)
- [ ] Connected to Supabase with proper credentials
- [ ] Sync rules YAML in `powersync/sync-rules.yaml`
- [ ] Two buckets defined: `workspace_shared` + `user_private`
- [ ] Sync rules pass YAML validation
- [ ] Bucket security tested (impersonation tests)

### Client

- [ ] PowerSync SDK installed in Product App
- [ ] op-sqlite for local DB
- [ ] On app start: sync engine initializes, downloads workspace data
- [ ] Local DB persists across app restarts
- [ ] Schema generated from PowerSync (`npx powersync-cli`)
- [ ] React hooks: `usePowerSyncQuery` works in components

### End-to-End

- [ ] Write task on web → see on mobile within 200ms
- [ ] Write task offline → reconnect → syncs to server
- [ ] Two devices edit same task → last-write-wins
- [ ] User signs out → local DB cleared (security)

### Backups

- [ ] Supabase auto-backups enabled (daily, 7-day retention)
- [ ] Manual backup tested (export, verify, simulate restore)

## Implementation Plan

### Step 1: Read & Plan (~2 hours)

Re-read `data-model.md` fully. Re-read PowerSync docs current version. Plan migration order (tables with FK dependencies must come after their references).

### Step 2: Migration files (~6-8 hours)

Split into logical migrations:

- `0002_workspaces_extended.sql` — workspace_settings, areas
- `0003_visions_goals.sql` — visions, goals, key_results
- `0004_projects_tasks.sql` — projects, tasks, subtasks
- `0005_habits.sql` — habits, habit_logs, streak_state
- `0006_focus_journal.sql` — focus_sessions, journal_entries
- `0007_rituals.sql` — morning_rituals, evening_rituals, ceo_reviews
- `0008_knowledge.sql` — knowledge_entries, attachments
- `0009_health.sql` — energy_logs, sleep_logs, emotion_logs
- `0010_gamification.sql` — xp_events, xp_state, badges
- `0011_calendar.sql` — calendar_events (read-only cache)
- `0012_notifications.sql` — notifications, ai_coach_usage
- `0013_activity_log.sql` — audit log

### Step 3: RLS policies (~4-6 hours)

Per table, write policies. Test each via SQL impersonation (`SET LOCAL request.jwt.claim.sub = '<user-id>'; SELECT * FROM tasks;`).

### Step 4: PowerSync service setup (~3 hours)

- Create EU region instance
- Connect to Supabase with service role key (kept secret)
- Verify Supabase replication slot is created
- Test connection

### Step 5: Sync rules YAML (~6 hours)

Per `data-model.md` PowerSync section:

- `workspace_shared` bucket: tables shared across Duo workspace members
- `user_private` bucket: per-user private (journal, health, calendar, AI coach interactions)
- Test each bucket rule with sample data

### Step 6: PowerSync client SDK (~6 hours)

- Install `@powersync/react-native` + dependencies
- Configure `lib/powersync/setup.ts`
- Auth handler (uses Supabase JWT for PowerSync auth)
- Schema generation
- Hook integration: `usePowerSyncQuery`

### Step 7: First sync test (~3 hours)

Manual end-to-end: insert task via Supabase dashboard → verify appears in Product App
Then: insert via Product App → verify appears in Postgres

### Step 8: Adversarial security tests (~5 hours)

**CRITICAL.** Cannot skip.

- User A logs in, queries Workspace B data → must fail
- User A modifies sync rules client-side → server must enforce
- User A accesses another user's private data (journal) → must fail
- Document tests in `docs/security-tests.md`

### Step 9: Conflict resolution tests (~3 hours)

- Both devices offline, edit same task differently
- Reconnect both
- Last-write-wins by `updated_at`
- Document edge cases (clock skew, simultaneous saves)

### Step 10: Backup configuration (~1 hour)

- Supabase Dashboard → Database → Backups → enable
- Test manual export
- Document restore procedure

### Step 11: Documentation (~3 hours)

- `docs/sync-rules.md` — explains buckets + tests
- `docs/security-tests.md` — RLS test results
- `docs/backup-recovery.md` — DR procedure
- Update `data-model.md` if any deviations

### Step 12: Code review + commit (~2 hours)

## Common Pitfalls (LOTS — this is the hardest phase)

**1. RLS off by default** — when you `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, it's now restrictive. Make sure to add policies BEFORE enabling RLS, or you lock yourself out.

**2. Service role bypasses RLS** — that's by design. Don't use service role on client EVER. Server-only.

**3. PowerSync credentials confusion** — service role key for PowerSync (server-side), anon key for client. Different roles.

**4. Bucket rules vs RLS** — both must be correct. PowerSync uses Sync Rules as primary security; RLS is defense-in-depth.

**5. Local SQLite schema drift** — if you change DB schema, must regenerate PowerSync schema, deploy migrations, update sync rules, and force client schema upgrade.

**6. Conflict resolution gotchas** — "last-write-wins by updated_at" works 95% of the time. The 5% edge cases (concurrent edits, clock skew) need documentation.

**7. Initial sync timing** — first hydration of local DB can be slow. Show splash/loading screen, not blank app.

**8. Sync rules YAML syntax** — strict YAML. One typo and rules silently fail (or worse, allow too much). Use validator.

**9. Real-time vs eventual consistency** — PowerSync is eventually consistent. Sync delay typically 200-500ms. Don't UI-block waiting for sync.

**10. Migration ordering** — tables with FK constraints must reference existing tables. Plan migration order carefully.

**11. UUID v4 for all IDs** — use `gen_random_uuid()` default. Never auto-incrementing IDs (sync conflicts).

**12. Triggers and PowerSync** — triggers work but PowerSync sees raw INSERTs. If trigger derives data, ensure idempotency.

## Done When

- All adversarial tests pass
- Two-device sync verified live
- Offline → onl