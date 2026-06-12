# Phase 09 EXPANDED — Database Schema + PowerSync Setup

> Expanded from the stub on 2026-06-05 based on:
>
> - Full read of data-model.md, ADR 0008, ADR 0010
> - Live PowerSync documentation (docs.powersync.com, verified June 2025)
> - Current Phase 08 migration state (0001–0005)
>
> **Status:** Approved (2026-06-05) — with finance architecture amendment (visibility split). Migrations start immediately.

---

## CRITICAL CORRECTIONS vs. docs/data-model.md

These discrepancies must be resolved before writing a single line of SQL.

### 1. `token_parameters.user_id` is OUTDATED

`data-model.md` sync rules use:

```yaml
WHERE user_id = token_parameters.user_id
```

The current PowerSync sync rules syntax is:

```yaml
WHERE user_id = request.user_id()
```

`token_parameters` is no longer documented. All sync rules must use `request.user_id()`.

### 2. `profiles.name` vs. `display_name`

Phase 08 migration created `profiles.name`. `data-model.md` uses `display_name`. They are the same conceptual field. **Migration 0006 renames `name` → `display_name`** to match the spec. The `handle_new_user()` trigger must also be updated.

### 3. PowerSync auth = dedicated DB role, NOT service_role key

`data-model.md` and ADR 0008 do not specify how PowerSync authenticates to Postgres. The current PowerSync docs require:

```sql
CREATE ROLE powersync_role WITH REPLICATION BYPASSRLS LOGIN PASSWORD '...';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO powersync_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO powersync_role;
CREATE PUBLICATION powersync FOR ALL TABLES;
```

This replaces any assumption that PowerSync uses the Supabase service role key. The Supabase service role key is NEVER used for PowerSync; the connection string + `powersync_role` credentials are entered in the PowerSync Dashboard.

### 4. Sync Streams vs. Legacy Sync Rules

PowerSync now has two formats:

| Format                   | Key                              | Recommended             |
| ------------------------ | -------------------------------- | ----------------------- |
| Sync Streams (Edition 3) | `config.edition: 3` + `streams:` | ✅ New default          |
| Legacy Sync Rules        | `bucket_definitions:`            | Still supported, legacy |

**Decision for Phase 09:** Use **Legacy Sync Rules** (bucket_definitions) because:

- data-model.md already designed the bucket structure
- Workspace-parameterized buckets fit the bucket_definitions model perfectly
- Sync Streams are simpler for user_id-only filtering; workspace-scoped data is better expressed with explicit bucket parameters
- We avoid risk of edge cases in the newer format

We note Sync Streams as the Phase 13+ migration target if the legacy format causes issues.

### 5. Stripe columns in `workspaces`

`data-model.md` includes `stripe_customer_id` and `stripe_subscription_id` on `workspaces`. These are created as nullable columns in Phase 09 but contain no data. Payment logic is Phase 22.

---

## EXISTING SCHEMA (Phase 08 State)

Migrations 0001–0005 created:

| Table               | Status | Gaps vs. data-model.md                                                                                  |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `profiles`          | Exists | Missing: `email`, `display_name` (has `name`), `timezone`, `role`, `onboarded_at`, `updated_at`         |
| `workspaces`        | Exists | Missing: `emoji`, `plan`, `stripe_customer_id`, `stripe_subscription_id`, `trial_ends_at`, `updated_at` |
| `workspace_members` | Exists | Complete for Phase 09                                                                                   |
| Helper functions    | Exists | `is_workspace_member()`, `is_workspace_owner()` in migration 0004                                       |

All other tables (~30) do not yet exist.

---

## MIGRATION ORDER (FK Dependency Chain)

**Start from 0006.** Migrations 0001–0005 are Phase 08.

```
0006_extend_profiles_workspaces.sql
0007_workspace_invites_areas.sql
0008_visions.sql
0009_goals_projects.sql
0010_tasks.sql
0011_habits.sql
0012_focus_inbox.sql
0013_reflection.sql
0014_knowledge.sql
0015_wellbeing.sql
0016_finance.sql
0017_calendar.sql
0018_xp_gamification.sql
0019_notifications.sql
0020_attachments_activity.sql
0021_indexes.sql
0022_powersync_setup.sql
```

### Dependency graph (must respect order)

```
profiles ← workspaces ← workspace_members ← workspace_invites
workspaces → areas
areas → visions → goals → projects → project_kanban_columns
projects → tasks (+ self-ref parent_task_id)
tasks → task_assignees
workspaces → habits → habit_logs
workspaces + tasks → focus_sessions
workspaces → inbox_items
workspaces → journal_entries / morning_rituals / evening_rituals / ceo_reviews
goals + projects → knowledge_entries → knowledge_tags
workspaces → energy_logs / sleep_logs / emotion_logs
workspaces → financial_accounts → financial_transactions
workspaces + tasks + areas → calendar_events
profiles → calendar_integrations
workspaces → xp_events / xp_state / badges
workspaces → notifications / notification_preferences
workspaces → attachments / activity_log
```

### `tasks` self-reference

`tasks.parent_task_id` is a self-referential FK. The column is created as nullable initially, then the FK constraint is added after the table exists:

```sql
ALTER TABLE tasks
  ADD CONSTRAINT tasks_parent_task_id_fkey
  FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;
```

---

## DETAILED MIGRATION SPECS

### 0006 — Extend profiles + workspaces

**profiles:**

```sql
-- Rename name → display_name
ALTER TABLE public.profiles RENAME COLUMN name TO display_name;

-- Add missing columns
ALTER TABLE public.profiles
  ADD COLUMN email        text,
  ADD COLUMN timezone     text NOT NULL DEFAULT 'Europe/Berlin',
  ADD COLUMN role         text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  ADD COLUMN onboarded_at timestamptz,
  ADD COLUMN updated_at   timestamptz NOT NULL DEFAULT now();

-- Backfill email from auth.users
UPDATE public.profiles p
  SET email = u.email
  FROM auth.users u
  WHERE u.id = p.id;

-- Make email NOT NULL after backfill
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;

-- Update the handle_new_user() trigger to set email + display_name
-- (replace old function)
CREATE OR REPLACE FUNCTION public.handle_new_user() ...
```

**workspaces:**

```sql
ALTER TABLE public.workspaces
  ADD COLUMN emoji                    text,
  ADD COLUMN plan                     text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'duo')),
  ADD COLUMN stripe_customer_id       text,
  ADD COLUMN stripe_subscription_id   text,
  ADD COLUMN trial_ends_at            timestamptz,
  ADD COLUMN updated_at               timestamptz NOT NULL DEFAULT now();
```

**updated_at trigger on both tables** (using shared `set_updated_at()` function — create here).

**RLS addition on workspaces:** add INSERT policy so users can't create workspaces directly (only via trigger):

```sql
-- No INSERT policy on workspaces — only the trigger creates them.
-- Stripe fields NOT readable by authenticated role:
-- stripe_customer_id + stripe_subscription_id columns have no dedicated policy
-- but since SELECT policy already scopes to workspace members, the data
-- IS readable by members. Stripe IDs move to a server-only view in Phase 22.
-- TODO Phase 22: create stripe_data view accessible only via service role.
```

### 0007 — workspace_invites + areas

**workspace_invites:** (NOT synced via PowerSync — queried only via Supabase RPC at accept-time)

```sql
CREATE TABLE public.workspace_invites (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email         text NOT NULL,
  invited_by    uuid NOT NULL REFERENCES profiles(id),
  token         text NOT NULL UNIQUE,
  expires_at    timestamptz NOT NULL,
  accepted_at   timestamptz
);
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;
-- Only workspace owner can see/create invites
```

**areas:** (`workspace_shared` bucket)

```sql
CREATE TABLE public.areas (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name          text NOT NULL,
  color         text NOT NULL,
  emoji         text,
  position      int NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
-- Standard workspace_member RLS (SELECT/INSERT/UPDATE/DELETE)
```

### 0008 — visions, vision_values, annual_letters

All workspace-scoped. `visions` and `annual_letters` have `updated_at`. `vision_values` is a join table (no `updated_at` needed — DELETE/INSERT pattern).

**Soft delete on visions:** `archived_at` column (not hard delete — annual_letters reference them).

### 0009 — goals, key_results, projects, project_kanban_columns

All workspace-scoped. `goals` and `projects` have `updated_at` and `archived_at` (soft delete).

**`goals.area_id`** references `areas` which is created in 0007 ✓  
**`projects.goal_id`** references `goals` from this same migration. Order: goals first, then key_results, then projects, then project_kanban_columns.

### 0010 — tasks, task_assignees

**tasks** — most complex table:

```sql
CREATE TABLE public.tasks (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id          uuid REFERENCES projects(id) ON DELETE SET NULL,
  parent_task_id      uuid, -- FK added below (self-referential)
  area_id             uuid REFERENCES areas(id) ON DELETE SET NULL,
  kanban_column_id    uuid REFERENCES project_kanban_columns(id) ON DELETE SET NULL,
  title               text NOT NULL,
  description         text,
  priority            text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  energy              text NOT NULL DEFAULT 'medium' CHECK (energy IN ('high', 'medium', 'low')),
  scheduled_for       date,
  deadline            date,
  estimated_minutes   int,
  is_obt              boolean NOT NULL DEFAULT false,
  status              text NOT NULL DEFAULT 'todo'
                      CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'someday')),
  completed_at        timestamptz,
  completed_by        uuid REFERENCES profiles(id),
  recurrence          jsonb,
  position            int NOT NULL DEFAULT 0,
  created_by          uuid NOT NULL REFERENCES profiles(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Self-referential FK added after table creation
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_parent_task_id_fkey
  FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
-- updated_at trigger
```

**task_assignees** — join table, no updated_at.

**RLS for tasks:**

```sql
CREATE POLICY "tasks: select for members"
  ON tasks FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "tasks: insert for members"
  ON tasks FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id) AND created_by = auth.uid());

CREATE POLICY "tasks: update for members"
  ON tasks FOR UPDATE
  USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "tasks: delete for creator or owner"
  ON tasks FOR DELETE
  USING (
    created_by = auth.uid()
    OR public.is_workspace_owner(workspace_id)
  );
```

### 0011 — habits, habit_logs

**habits** has `updated_at` and `archived_at` (soft delete — preserve streak history).  
**habit_logs** is append-only (no `updated_at`, no UPDATE).

**UNIQUE constraint on habit_logs:** `(habit_id, user_id, logged_for)` — prevents double-logging.

**RLS on habit_logs:** Workspace-scoped via `habit_id → habits.workspace_id`. Since habit_logs doesn't have `workspace_id` directly, use a JOIN-based policy:

```sql
CREATE POLICY "habit_logs: select for workspace members"
  ON habit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM habits h
      WHERE h.id = habit_id
        AND public.is_workspace_member(h.workspace_id)
    )
  );
```

### 0012 — focus_sessions, inbox_items

**focus_sessions:** user_private bucket (personal focus data). Has `updated_at`.  
**inbox_items:** workspace_shared bucket. Has `updated_at`.

### 0013 — journal_entries, morning_rituals, evening_rituals, ceo_reviews

All are **user_private** (even in Duo workspaces). RLS `user_id = auth.uid()`.  
Each has `updated_at`. `morning_rituals` and `evening_rituals` have UNIQUE constraint on `(user_id, ritual_date)`.

### 0014 — knowledge_entries, knowledge_tags

**knowledge_entries:** workspace_shared bucket (knowledge can be shared in Duo). Has `updated_at`.  
**knowledge_tags:** join table (no `updated_at`).

### 0015 — energy_logs, sleep_logs, emotion_logs

All **user_private**. `energy_logs` and `sleep_logs` have UNIQUE on `(user_id, log_date)`.  
These have `updated_at` on `energy_logs` and `sleep_logs` (logs can be edited). `emotion_logs` is append-only.

### 0016 — financial_accounts, financial_transactions

Finance data has a **visibility split**: accounts can be private (owner only) or shared (all workspace members). This determines which sync bucket delivers them.

**`financial_accounts`** — two extra columns beyond data-model.md:

```sql
CREATE TABLE public.financial_accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  owner_id        uuid NOT NULL REFERENCES profiles(id),   -- who created/owns this account
  visibility      text NOT NULL DEFAULT 'private'
                  CHECK (visibility IN ('private', 'shared')),
  type            text NOT NULL CHECK (type IN ('checking', 'savings', 'investment', 'debt')),
  scope           text NOT NULL CHECK (scope IN ('personal', 'business')),
  name            text NOT NULL,
  current_balance numeric NOT NULL DEFAULT 0,
  currency        text NOT NULL DEFAULT 'EUR',
  updated_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
```

**`financial_accounts` RLS:**

```sql
-- SELECT: shared accounts are visible to all workspace members;
--         private accounts are visible only to owner
CREATE POLICY "financial_accounts: select"
  ON financial_accounts FOR SELECT
  USING (
    (visibility = 'shared' AND public.is_workspace_member(workspace_id))
    OR owner_id = auth.uid()
  );

-- INSERT: any workspace member can create an account (starts private by default)
CREATE POLICY "financial_accounts: insert"
  ON financial_accounts FOR INSERT
  WITH CHECK (
    public.is_workspace_member(workspace_id)
    AND owner_id = auth.uid()
  );

-- UPDATE / DELETE: only the owner manages their account
CREATE POLICY "financial_accounts: update"
  ON financial_accounts FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "financial_accounts: delete"
  ON financial_accounts FOR DELETE
  USING (owner_id = auth.uid());
```

**`financial_transactions`** — inherits visibility via `account_id → financial_accounts`. No `updated_at` (immutable; edit = delete + reinsert). RLS via JOIN on `financial_accounts`:

```sql
-- SELECT inherits account visibility (already enforced by sync rules + RLS on accounts)
CREATE POLICY "financial_transactions: select"
  ON financial_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM financial_accounts fa
      WHERE fa.id = account_id
        AND (
          (fa.visibility = 'shared' AND public.is_workspace_member(fa.workspace_id))
          OR fa.owner_id = auth.uid()
        )
    )
  );

CREATE POLICY "financial_transactions: insert"
  ON financial_transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM financial_accounts fa
      WHERE fa.id = account_id AND fa.owner_id = auth.uid()
    )
  );

CREATE POLICY "financial_transactions: delete"
  ON financial_transactions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM financial_accounts fa
      WHERE fa.id = account_id AND fa.owner_id = auth.uid()
    )
  );
```

### 0017 — calendar_events, calendar_integrations

**calendar_events:** workspace_shared. Has `updated_at`.  
**calendar_integrations:** user_private (OAuth tokens never shared). Has `updated_at`.

### 0018 — xp_events, xp_state, badges

**xp_events:** user_private, append-only (no `updated_at`).  
**xp_state:** user_private, mutable (has `updated_at`).  
**badges:** user_private, append-only (UNIQUE on `(user_id, badge_type)`).

### 0019 — notifications, notification_preferences

**notifications:** user_private. Has `updated_at` (for `read_at` updates).  
**notification_preferences:** user_private (keyed by `user_id`, mutable). Has `updated_at`.

### 0020 — attachments, activity_log

**attachments:** workspace_shared. Append-only (no `updated_at`).  
**activity_log:** workspace_shared. Append-only (no `updated_at`).

### 0021 — Performance Indexes

All indexes from `data-model.md` plus:

```sql
CREATE INDEX idx_tasks_workspace_status ON tasks(workspace_id, status) WHERE status != 'done';
CREATE INDEX idx_tasks_workspace_scheduled ON tasks(workspace_id, scheduled_for);
CREATE INDEX idx_tasks_obt ON tasks(workspace_id, scheduled_for) WHERE is_obt = true;
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, logged_for DESC);
CREATE INDEX idx_xp_events_user_occurred ON xp_events(user_id, occurred_at DESC);
CREATE INDEX idx_calendar_events_workspace_starts ON calendar_events(workspace_id, starts_at);
CREATE INDEX idx_inbox_workspace_pending ON inbox_items(workspace_id) WHERE status = 'pending';
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE read_at IS NULL;
CREATE INDEX idx_journal_user_date ON journal_entries(user_id, entry_date DESC);
-- Additional:
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id) WHERE parent_task_id IS NOT NULL;
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, logged_for DESC);
CREATE INDEX idx_visions_workspace ON visions(workspace_id) WHERE archived_at IS NULL;
CREATE INDEX idx_goals_workspace_quarter ON goals(workspace_id, quarter) WHERE archived_at IS NULL;
CREATE INDEX idx_projects_workspace_status ON projects(workspace_id, status) WHERE archived_at IS NULL;
```

### 0022 — PowerSync Setup

**IMPORTANT: This migration requires manual steps in the PowerSync Dashboard first.**  
The SQL runs in Supabase (local + cloud), but the Dashboard setup must happen before testing.

```sql
-- 1. Create dedicated replication role
CREATE ROLE powersync_role
  WITH REPLICATION BYPASSRLS LOGIN
  PASSWORD '<<SECURE_PASSWORD_FROM_SECRETS_MANAGER>>';

GRANT SELECT ON ALL TABLES IN SCHEMA public TO powersync_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO powersync_role;

-- 2. Create publication (FOR ALL TABLES is fine for dev; specify tables in prod)
CREATE PUBLICATION powersync FOR ALL TABLES;

-- 3. Helper function für RLS-Policies
--    ⚠️ KORRIGIERT (Audit 2026-06-10): NICHT im auth-Schema anlegen — Supabase sperrt seit
--    April 2025 eigene Objekte in auth/storage/realtime (Migration würde fehlschlagen).
--    Privates Schema `app` verwenden; data-model.md ist entsprechend angepasst.
CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.user_workspaces()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id FROM public.workspace_members
  WHERE user_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION app.user_workspaces() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.user_workspaces() TO authenticated;
GRANT USAGE ON SCHEMA app TO authenticated;
```

**Dashboard steps (Petja must do — requires PowerSync credentials):**

1. PowerSync Dashboard → New Instance → EU region (Frankfurt or Ireland)
2. Connection → Supabase → Direct connection string
3. Credentials: `powersync_role` + password from above
4. Client Auth → Supabase → JWKS URL: `https://<project>.supabase.co/auth/v1/.well-known/jwks.json`
5. Upload sync-rules.yaml (see below)
6. Verify replication slot is created in Supabase

---

## SYNC RULES YAML (Complete, Corrected)

File: `powersync/sync-rules.yaml`

Critical fix from data-model.md: `token_parameters.user_id` → `request.user_id()`

> ⚠️ **AUDIT-KORREKTUR (2026-06-10) — VOR DEPLOY LESEN:**
> 1. **Die JOINs in den Data Queries unten funktionieren im Legacy-Sync-Rules-Format NICHT**
>    (Data Queries erlauben nur einfache SELECTs auf eine Tabelle mit direktem
>    Bucket-Parameter-Match — keine JOINs, keine Subqueries). Gleiches gilt für die
>    IN-Subquery in der Parameter Query. Zwei gültige Wege:
>    **(a) Sync Streams von Anfang an** (Beta, offiziell für neue Projekte empfohlen —
>    unterstützt JOINs/Subqueries; unten steht ohnehin „Upgrade in Phase 13", dann lieber direkt), oder
>    **(b) Legacy-Format mit denormalisierter `workspace_id`** auf allen Kindtabellen —
>    so ist es jetzt in `data-model.md` (kanonisch) umgesetzt.
> 2. **Parameter Query vereinfachen:** `SELECT workspace_id FROM workspace_members WHERE user_id = request.user_id()` — ohne IN-Subquery.
> 3. **`habit_logs`:** laut data-model.md (kanonisch) in den `workspace_shared`-Bucket verschoben
>    (Duo-Accountability). Unten steht noch user_private — bei Umsetzung data-model.md folgen.
> 4. Das `visibility`-Konzept für Finanzen (shared/private) unten ist GUT und wurde in
>    data-model.md übernommen.

```yaml
# powersync/sync-rules.yaml
# Legacy Sync Rules format (bucket_definitions)
# Upgrade to Sync Streams (Edition 3) in Phase 13

bucket_definitions:
  # ─────────────────────────────────────────────────────────────────
  # Bucket 1: workspace_shared
  # Shared between all members of a workspace (Solo: just the owner;
  # Duo: both partners). Contains collaborative data.
  # ─────────────────────────────────────────────────────────────────
  workspace_shared:
    parameters: |
      SELECT id AS workspace_id
      FROM public.workspaces
      WHERE id IN (
        SELECT workspace_id
        FROM public.workspace_members
        WHERE user_id = request.user_id()
      )
    data:
      # Identity
      - SELECT id, name, type, owner_id, emoji, plan, trial_ends_at, created_at, updated_at
        FROM workspaces WHERE id = bucket.workspace_id
      # NOTE: stripe_customer_id and stripe_subscription_id intentionally omitted here.
      # Add via separate secure view in Phase 22.
      - SELECT * FROM workspace_members WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM areas WHERE workspace_id = bucket.workspace_id

      # Vision layer
      - SELECT * FROM visions WHERE workspace_id = bucket.workspace_id
      - SELECT vv.* FROM vision_values vv
        JOIN visions v ON v.id = vv.vision_id
        WHERE v.workspace_id = bucket.workspace_id
      - SELECT * FROM annual_letters WHERE workspace_id = bucket.workspace_id

      # Goals & Projects
      - SELECT * FROM goals WHERE workspace_id = bucket.workspace_id
      - SELECT kr.* FROM key_results kr
        JOIN goals g ON g.id = kr.goal_id
        WHERE g.workspace_id = bucket.workspace_id
      - SELECT * FROM projects WHERE workspace_id = bucket.workspace_id
      - SELECT pkc.* FROM project_kanban_columns pkc
        JOIN projects p ON p.id = pkc.project_id
        WHERE p.workspace_id = bucket.workspace_id

      # Execution
      - SELECT * FROM tasks WHERE workspace_id = bucket.workspace_id
      - SELECT ta.* FROM task_assignees ta
        JOIN tasks t ON t.id = ta.task_id
        WHERE t.workspace_id = bucket.workspace_id
      - SELECT * FROM habits WHERE workspace_id = bucket.workspace_id

      # Inbox
      - SELECT * FROM inbox_items WHERE workspace_id = bucket.workspace_id

      # Knowledge
      - SELECT * FROM knowledge_entries WHERE workspace_id = bucket.workspace_id
      - SELECT kt.* FROM knowledge_tags kt
        JOIN knowledge_entries ke ON ke.id = kt.knowledge_id
        WHERE ke.workspace_id = bucket.workspace_id

      # Calendar (events only — integrations are user_private)
      - SELECT * FROM calendar_events WHERE workspace_id = bucket.workspace_id

      # Finance — shared accounts only (visibility = 'shared')
      - SELECT * FROM financial_accounts
        WHERE workspace_id = bucket.workspace_id AND visibility = 'shared'
      - SELECT ft.* FROM financial_transactions ft
        JOIN financial_accounts fa ON fa.id = ft.account_id
        WHERE fa.workspace_id = bucket.workspace_id AND fa.visibility = 'shared'

      # Activity
      - SELECT * FROM activity_log WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM attachments WHERE workspace_id = bucket.workspace_id

  # ─────────────────────────────────────────────────────────────────
  # Bucket 2: user_private
  # Always private to the individual user.
  # In a Duo workspace, Partner B NEVER sees Partner A's private data.
  # ─────────────────────────────────────────────────────────────────
  user_private:
    parameters: |
      SELECT id AS user_id
      FROM public.profiles
      WHERE id = request.user_id()
    data:
      # Profile (only own)
      - SELECT * FROM profiles WHERE id = bucket.user_id

      # Reflection
      - SELECT * FROM journal_entries WHERE user_id = bucket.user_id
      - SELECT * FROM morning_rituals WHERE user_id = bucket.user_id
      - SELECT * FROM evening_rituals WHERE user_id = bucket.user_id
      - SELECT * FROM ceo_reviews WHERE user_id = bucket.user_id

      # Wellbeing
      - SELECT * FROM energy_logs WHERE user_id = bucket.user_id
      - SELECT * FROM sleep_logs WHERE user_id = bucket.user_id
      - SELECT * FROM emotion_logs WHERE user_id = bucket.user_id

      # Focus & habits progress (personal)
      - SELECT * FROM focus_sessions WHERE user_id = bucket.user_id
      - SELECT * FROM habit_logs WHERE user_id = bucket.user_id

      # XP & Gamification
      - SELECT * FROM xp_events WHERE user_id = bucket.user_id
      - SELECT * FROM xp_state WHERE user_id = bucket.user_id
      - SELECT * FROM badges WHERE user_id = bucket.user_id

      # Notifications
      - SELECT * FROM notifications WHERE user_id = bucket.user_id
      - SELECT * FROM notification_preferences WHERE user_id = bucket.user_id

      # Calendar OAuth (tokens sensitive, user-only)
      - SELECT * FROM calendar_integrations WHERE user_id = bucket.user_id

      # Finance — private accounts only (visibility = 'private', owner only)
      - SELECT * FROM financial_accounts
        WHERE owner_id = bucket.user_id AND visibility = 'private'
      - SELECT ft.* FROM financial_transactions ft
        JOIN financial_accounts fa ON fa.id = ft.account_id
        WHERE fa.owner_id = bucket.user_id AND fa.visibility = 'private'
```

### Tables NOT synced (server-only):

- `auth.*` — Supabase managed
- `workspace_invites` — queried only via Supabase RPC at accept-time
- `workspaces.stripe_customer_id` / `stripe_subscription_id` — excluded from SELECT in sync rules (see above)

---

## CLIENT SDK SETUP

### Packages

```bash
# In apps/product/
npx expo install @powersync/react-native
npx expo install @powersync/op-sqlite @op-engineering/op-sqlite
npm install --save @powersync/react
```

**Note on Expo Go:** `@powersync/op-sqlite` requires a dev build (native code). Expo Go will NOT work with PowerSync op-sqlite. Use `npx expo run:web` for web testing or build a dev client.

### File structure

```
apps/product/lib/powersync/
├── schema.ts              # Column definitions for all ~35 synced tables
├── connector.ts           # SupabaseConnector (fetchCredentials + uploadData)
├── database.ts            # PowerSyncDatabase singleton
└── PowerSyncProvider.tsx  # React context: initializes + connects on mount
```

### schema.ts pattern

```typescript
import { column, Schema, Table } from '@powersync/react-native';

// IMPORTANT: 'id' column is auto-generated by PowerSync SDK — do NOT declare it.
// Dates stored as column.text (SQLite has no native date type).
// UUIDs stored as column.text.
// booleans stored as column.integer (0/1).
// jsonb stored as column.text (serialize/deserialize in app).

const tasks = new Table(
  {
    workspace_id: column.text,
    project_id: column.text,
    parent_task_id: column.text,
    area_id: column.text,
    kanban_column_id: column.text,
    title: column.text,
    description: column.text,
    priority: column.text,
    energy: column.text,
    scheduled_for: column.text, // stored as ISO date string
    deadline: column.text,
    estimated_minutes: column.integer,
    is_obt: column.integer, // 0 | 1
    status: column.text,
    completed_at: column.text,
    completed_by: column.text,
    recurrence: column.text, // JSON.stringify(recurrence)
    position: column.integer,
    created_by: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      workspace_status: ['workspace_id', 'status'],
      scheduled: ['workspace_id', 'scheduled_for'],
    },
  }
);

// ... define all ~35 tables similarly

export const AppSchema = new Schema({
  profiles,
  workspaces,
  workspace_members,
  areas,
  visions,
  vision_values,
  annual_letters,
  goals,
  key_results,
  projects,
  project_kanban_columns,
  tasks,
  task_assignees,
  habits,
  habit_logs,
  focus_sessions,
  inbox_items,
  journal_entries,
  morning_rituals,
  evening_rituals,
  ceo_reviews,
  knowledge_entries,
  knowledge_tags,
  energy_logs,
  sleep_logs,
  emotion_logs,
  financial_accounts,
  financial_transactions,
  calendar_events,
  calendar_integrations,
  xp_events,
  xp_state,
  badges,
  notifications,
  notification_preferences,
  attachments,
  activity_log,
});

export type Database = (typeof AppSchema)['types'];
```

### connector.ts pattern

```typescript
import {
  PowerSyncBackendConnector,
  AbstractPowerSyncDatabase,
  UpdateType,
} from '@powersync/react-native';
import { supabase } from '@/lib/supabase';

export class SupabaseConnector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) throw new Error('Not authenticated');
    return {
      endpoint: process.env.EXPO_PUBLIC_POWERSYNC_URL!,
      token: session.access_token,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase) {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    try {
      for (const op of transaction.crud) {
        const table = op.table;
        const id = op.id;
        const data = op.opData ?? {};

        switch (op.op) {
          case UpdateType.PUT: {
            const { error } = await supabase.from(table).upsert({ id, ...data });
            if (error) throw error;
            break;
          }
          case UpdateType.PATCH: {
            const { error } = await supabase.from(table).update(data).eq('id', id);
            if (error) throw error;
            break;
          }
          case UpdateType.DELETE: {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            break;
          }
        }
      }
      await transaction.complete();
    } catch (error) {
      console.error('[PowerSync] uploadData error:', error);
      // Do NOT call transaction.complete() on error — let PowerSync retry
    }
  }
}
```

### database.ts pattern

```typescript
import { PowerSyncDatabase } from '@powersync/react-native';
import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { AppSchema } from './schema';

export const powersync = new PowerSyncDatabase({
  schema: AppSchema,
  database: new OPSqliteOpenFactory({ dbFilename: 'apex.db' }),
});
```

### PowerSyncProvider.tsx pattern

```typescript
import { PowerSyncContext } from '@powersync/react';
import { useEffect } from 'react';
import { powersync } from './database';
import { SupabaseConnector } from './connector';
import { supabase } from '@/lib/supabase';

export function PowerSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const connector = new SupabaseConnector();
    powersync.connect(connector);

    // Re-connect when Supabase auth state changes (new JWT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          await powersync.connect(connector);
        }
        if (event === 'SIGNED_OUT') {
          await powersync.disconnect();
          await powersync.clearLocalDatabase(); // Security: wipe on logout
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <PowerSyncContext.Provider value={powersync}>
      {children}
    </PowerSyncContext.Provider>
  );
}
```

### \_layout.tsx integration

```typescript
// Wrap AuthProvider with PowerSyncProvider INSIDE (auth must be available):
<AuthProvider>
  <PowerSyncProvider>
    <Stack ... />
  </PowerSyncProvider>
</AuthProvider>
```

### Using queries in components

```typescript
import { useQuery } from '@powersync/react';

function TaskList({ workspaceId }: { workspaceId: string }) {
  const { data: tasks } = useQuery(
    'SELECT * FROM tasks WHERE workspace_id = ? AND status != ? ORDER BY position',
    [workspaceId, 'done']
  );
  // ...
}
```

---

## THE 4 ADVERSARIAL SYNC TESTS

These must pass before Phase 09 is marked done. Document results in `docs/security-tests.md`.

### Test 1: Bucket Isolation (Two Solo Users)

**Setup:**

- Create user A: `petja.klass+sync1@gmail.com` (with solo workspace, create 3 tasks)
- Create user B: `petja.klass+sync2@gmail.com` (with solo workspace, create 3 tasks)

**Procedure:**

1. Sign in as User A on the Product App (web: localhost:8081)
2. After sync completes, open PowerSync DevTools (or query the local SQLite):
   ```sql
   SELECT * FROM tasks;
   ```
3. Verify: ONLY User A's 3 tasks are present. User B's tasks must NOT appear.
4. Repeat: sign in as User B, verify only User B's tasks.

**Pass criterion:** 0 rows from other user's workspace in local SQLite.
**Fail action:** STOP. Sync rule has data leak. Investigate bucket parameters.

### Test 2: Duo Workspace — Private Data Isolation

**Setup:**

- Create a Duo workspace, invite User B (sync2) to User A's (sync1) workspace.
- User A creates: 1 task (shared), 1 journal entry (private)
- User B creates: 1 task (shared), 1 journal entry (private)

**Procedure:**

1. Sign in as User A, wait for sync.
2. Query local SQLite:
   ```sql
   SELECT * FROM journal_entries;
   SELECT * FROM tasks;
   ```
3. Expected: tasks shows BOTH tasks (shared), journal_entries shows ONLY User A's entry.
4. Repeat as User B: tasks shows both, journal_entries shows only User B's entry.

**Pass criterion:** journal_entries, morning_rituals, evening_rituals, ceo_reviews, energy_logs, sleep_logs, emotion_logs — only own rows visible.
**Fail action:** STOP. user_private bucket has incorrect filter.

### Test 3: Offline Conflict Resolution (Last-Write-Wins)

**Setup:**

- User A on device 1 and device 2, both signed in, sync complete.
- Task T1 exists with `title = "Original"`.

**Procedure:**

1. Take both devices offline (airplane mode).
2. Device 1: update T1 title to "Device 1 Edit" (this writes to local SQLite + queue).
3. Device 2: update T1 title to "Device 2 Edit" (different `updated_at` timestamp — device 2's clock is slightly later — simulate by waiting 1 second before editing on device 2).
4. Bring both devices online. Device 1 first, then device 2.
5. After sync stabilizes: T1 title should be "Device 2 Edit" (later `updated_at` wins).
6. Verify no errors in console / PowerSync logs.

**Pass criterion:** Stable final state, no crash, `updated_at` determines winner.
**Edge case to document:** What happens if clocks are identical? PowerSync resolves by insertion order on the server — document this.

### Test 4: Logout Data Wipe

**Setup:**

- User A signed in, workspace fully synced (50+ rows in local SQLite).

**Procedure:**

1. Trigger sign-out (from the sign-in screen's "Abmelden" button or directly via `supabase.auth.signOut()`).
2. The `PowerSyncProvider` SIGNED_OUT handler calls `powersync.disconnect()` + `powersync.clearLocalDatabase()`.
3. Query local SQLite immediately after:
   ```sql
   SELECT COUNT(*) FROM tasks;
   SELECT COUNT(*) FROM journal_entries;
   ```
4. All queries must return 0.
5. Restart the app (to verify persistence is cleared, not just in-memory).
6. Verify app shows "Nicht eingeloggt" state (not stale data from previous session).

**Pass criterion:** 0 rows in all tables after logout + restart.
**Fail action:** STOP. Data wipe mechanism is broken — security issue.

### Test 5: Finance Visibility Split in Duo Workspace

**Setup:**

- Duo workspace, User A (sync1) and User B (sync2) both members.
- User A creates two financial accounts:
  - Account P: `name = "Geheimes Konto"`, `visibility = 'private'`, `owner_id = User A`
  - Account S: `name = "Gemeinsames Konto"`, `visibility = 'shared'`, `owner_id = User A`
- Add 1 transaction to each account (from User A, while online).

**Procedure:**

1. Sign in as User B (sync2), wait for sync to complete.
2. Query local SQLite:
   ```sql
   SELECT name, visibility FROM financial_accounts;
   SELECT COUNT(*) FROM financial_transactions;
   ```
3. Expected:
   - `financial_accounts` returns exactly 1 row: `"Gemeinsames Konto"` (shared).
   - `"Geheimes Konto"` must NOT appear.
   - `financial_transactions` returns 1 row (the shared account's transaction only).
4. Try to INSERT a transaction against Account P's ID directly (via Supabase client with User B's JWT):
   ```sql
   INSERT INTO financial_transactions (account_id, transaction_date, amount, category)
   VALUES ('<account_P_id>', '2026-06-05', -100, 'test');
   ```
5. Expected: RLS violation (403). User B cannot write to another user's private account.

**Pass criterion:**

- Private account and its transactions invisible to partner.
- Shared account and its transaction visible.
- Direct INSERT attack on private account rejected by RLS.

**Fail action:** STOP. Finance visibility split is broken — data leak between Duo partners.

---

## RLS POLICY SUMMARY TABLE

| Table                    | Scope     | SELECT                                  | INSERT                      | UPDATE                    | DELETE                   |
| ------------------------ | --------- | --------------------------------------- | --------------------------- | ------------------------- | ------------------------ |
| profiles                 | own       | `id = auth.uid()`                       | — (trigger only)            | `id = auth.uid()`         | —                        |
| workspaces               | workspace | `is_workspace_member`                   | — (trigger only)            | owner only                | owner only               |
| workspace_members        | workspace | `is_workspace_member`                   | owner only                  | —                         | owner or self            |
| workspace_invites        | workspace | owner only                              | owner only                  | owner only                | owner only               |
| areas                    | workspace | `is_workspace_member`                   | member                      | member                    | owner                    |
| visions                  | workspace | `is_workspace_member`                   | member                      | member                    | owner or creator         |
| vision_values            | workspace | via vision                              | via vision                  | via vision                | via vision               |
| annual_letters           | workspace | `is_workspace_member`                   | member                      | creator                   | creator                  |
| goals                    | workspace | `is_workspace_member`                   | member                      | member                    | owner or creator         |
| key_results              | workspace | via goal                                | via goal                    | via goal                  | via goal                 |
| projects                 | workspace | `is_workspace_member`                   | member                      | member                    | owner or creator         |
| project_kanban_columns   | workspace | via project                             | via project                 | via project               | via project              |
| tasks                    | workspace | `is_workspace_member`                   | member                      | member                    | creator or owner         |
| task_assignees           | workspace | via task                                | via task                    | —                         | via task                 |
| habits                   | workspace | `is_workspace_member`                   | member                      | member                    | creator or owner         |
| habit_logs               | workspace | via habit                               | user_id = uid               | —                         | user_id = uid            |
| focus_sessions           | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| inbox_items              | workspace | `is_workspace_member`                   | member                      | member                    | creator                  |
| journal_entries          | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| morning_rituals          | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| evening_rituals          | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| ceo_reviews              | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| knowledge_entries        | workspace | `is_workspace_member`                   | member                      | member                    | creator or owner         |
| knowledge_tags           | workspace | via knowledge_entry                     | via knowledge_entry         | —                         | via knowledge_entry      |
| energy_logs              | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| sleep_logs               | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| emotion_logs             | user      | `user_id = uid`                         | `user_id = uid`             | —                         | `user_id = uid`          |
| financial_accounts       | hybrid    | `(shared AND member) OR owner_id = uid` | `member AND owner_id = uid` | `owner_id = uid`          | `owner_id = uid`         |
| financial_transactions   | hybrid    | via account (inherits visibility)       | via account (owner only)    | —                         | via account (owner only) |
| calendar_events          | workspace | `is_workspace_member`                   | member                      | member                    | creator                  |
| calendar_integrations    | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | `user_id = uid`          |
| xp_events                | user      | `user_id = uid`                         | service role only           | —                         | —                        |
| xp_state                 | user      | `user_id = uid`                         | service role only           | service role only         | —                        |
| badges                   | user      | `user_id = uid`                         | service role only           | —                         | —                        |
| notifications            | user      | `user_id = uid`                         | service role only           | `user_id = uid` (read_at) | `user_id = uid`          |
| notification_preferences | user      | `user_id = uid`                         | `user_id = uid`             | `user_id = uid`           | —                        |
| attachments              | workspace | `is_workspace_member`                   | member                      | —                         | creator or owner         |
| activity_log             | workspace | `is_workspace_member`                   | service role only           | —                         | —                        |

---

## ENVIRONMENT VARIABLES

Required additions to `apps/product/.env.local`:

```env
EXPO_PUBLIC_POWERSYNC_URL=https://<<instance-id>>.powersync.journeyapps.com
```

The PowerSync URL is obtained from the PowerSync Dashboard after instance creation. **Petja must provide this** — it requires PowerSync credentials.

---

## KNOWN GOTCHAS (Phase 09 Specific)

1. **`powersync_role` must have BYPASSRLS** — The sync service reads all workspace data to determine bucket contents. RLS would block this if not bypassed. This is correct behavior (sync rules are the security boundary).

2. **Expo Go incompatibility** — `@powersync/op-sqlite` uses native SQLite. Cannot test in Expo Go. Must use `npx expo run:web` (web via WASM) or create a Dev Build via EAS for mobile.

3. **WAL lag on Supabase free tier** — Free tier Supabase projects can have WAL lag. During testing, inserts may not appear in sync for 2-5 seconds (not 200ms). This is a free tier limitation, not a bug.

4. **Self-referential FK on `tasks`** — `parent_task_id` FK added as separate ALTER TABLE after table creation. Don't try to declare it inline — creates a circular reference error.

5. **`id` column in PowerSync schema** — The PowerSync SDK auto-adds `id` to every table in the client schema. Do NOT declare it in `schema.ts` or you'll get a duplicate column error.

6. **Stripe column visibility** — `workspaces` is in the workspace_shared bucket. The sync rule SELECT intentionally excludes `stripe_customer_id` and `stripe_subscription_id` (column-level exclusion). This is not RLS — it's sync rule filtering. RLS alone doesn't hide individual columns.

7. **`handle_new_user()` trigger** — Migration 0006 alters the trigger to also set `email` from `auth.users`. The function is SECURITY DEFINER and already has REVOKE in place. After rename `name` → `display_name`, update the function body to use `display_name`.

8. **`updated_at` trigger function** — Create `set_updated_at()` once in migration 0006, reuse in all subsequent migrations. Don't recreate it per migration.

9. **Local Supabase seed data** — Update `supabase/seed.sql` after all migrations to include example rows for all new tables. Used for local dev/testing.

---

## IMPLEMENTATION STEPS (Execution Plan)

### Phase A: Migrations (estimated 8-10h)

1. Write and test all 17 migrations (0006–0022) locally with `supabase db reset`
2. Verify `pnpm typecheck` after each migration (gen types intermediately)
3. Adversarial RLS tests after each migration group (use SQL SET ROLE impersonation)
4. Apply to cloud Supabase: `supabase db push --linked`
5. Regenerate types: `supabase gen types typescript --linked > packages/types/src/database.ts`

### Phase B: PowerSync Service Setup (estimated 1-2h, Petja needed)

**STOP HERE.** Petja must:

1. Log into PowerSync Dashboard (accounts.powersync.com)
2. Create EU instance
3. Enter Supabase connection credentials (`powersync_role` + password)
4. Configure Supabase JWT auth (JWKS URL)
5. Upload `powersync/sync-rules.yaml`
6. Provide `EXPO_PUBLIC_POWERSYNC_URL` env var

### Phase C: Client SDK (estimated 6-8h)

1. Install packages
2. Write `lib/powersync/schema.ts` (all ~37 tables)
3. Write `lib/powersync/connector.ts` (SupabaseConnector)
4. Write `lib/powersync/database.ts` (singleton)
5. Write `lib/powersync/PowerSyncProvider.tsx` (with auth state listener)
6. Wire into `_layout.tsx`
7. Verify sync in browser (localhost:8081)
8. `pnpm typecheck + lint`

### Phase D: Adversarial Tests (estimated 4-5h)

1. Create test users via Gmail trick
2. Run all 4 adversarial tests (documented in `docs/security-tests.md`)
3. All 4 must PASS before proceeding

### Phase E: Documentation + Commit (estimated 2h)

1. `docs/security-tests.md` — results of all 4 adversarial tests
2. `docs/phases/log.md` — Phase 09 completion entry
3. Update `data-model.md` if any deviations (column renames, etc.)
4. Final commit: `feat(db,sync): full schema + PowerSync end-to-end`

---

## ACCEPTANCE CRITERIA CHECKLIST

### Database

- [ ] All ~37 tables (including ~8 join tables) created via migrations 0006–0022
- [ ] All RLS policies match the summary table above
- [ ] `updated_at` trigger applied to all mutable synced tables
- [ ] `archived_at` soft delete on: habits, goals, visions, projects
- [ ] All FK constraints verified (no orphan rows possible)
- [ ] All performance indexes from migration 0021 applied
- [ ] Generated TS types include all tables (`packages/types/src/database.ts`)

### PowerSync Service

- [ ] EU instance running
- [ ] `powersync_role` + publication verified
- [ ] `powersync/sync-rules.yaml` validated (no YAML errors)
- [ ] Two buckets: `workspace_shared` + `user_private`
- [ ] `request.user_id()` syntax (not `token_parameters.user_id`)

### Client

- [ ] `@powersync/react-native` + `@powersync/op-sqlite` installed
- [ ] `lib/powersync/schema.ts` — all tables, correct column types
- [ ] `lib/powersync/connector.ts` — fetchCredentials + uploadData
- [ ] `PowerSyncProvider` in `_layout.tsx` (inside AuthProvider)
- [ ] `useQuery` works in at least one component (smoke test)
- [ ] Logout triggers `clearLocalDatabase()`

### Security Tests

- [ ] Test 1 PASS: bucket isolation (0 rows from other user)
- [ ] Test 2 PASS: duo private isolation (journal invisible to partner)
- [ ] Test 3 PASS: offline conflict LWW (no crash, 