# Apex — Data Model

> Postgres schema, Row Level Security policies, and migration philosophy.
> This document is authoritative for all database structure.

---

## Core Concept: Workspace-Centric Multi-Tenancy

**Every piece of user data belongs to a workspace, not a user directly.**

A user owns at least one workspace (their personal one) and can be a member of one shared workspace (their Duo). All entities — tasks, goals, habits, journal entries, etc. — have a `workspace_id` foreign key. RLS policies enforce that users can only read/write data in workspaces they belong to.

Why this matters: It is the difference between "Apex supports Duo" being a feature and a refactor. If we built user-scoped first and added workspaces later, we would rewrite every query and every policy. We do it once, correctly, from Phase 9.

```
┌──────────┐         ┌──────────────────┐         ┌──────────┐
│  users   │────┬───►│workspace_members │◄────────│workspaces│
└──────────┘    │    └──────────────────┘         └────┬─────┘
                │                                       │
                └─── all entities reference ────────────┘
                     workspace_id (not user_id)
                     except `owner_id` for credit/XP
```

## Schema Overview

Below is the canonical schema. Each table includes only the most relevant columns; full DDL with constraints, indexes, and RLS lives in `supabase/migrations/`.

> **Regel (gilt für ALLE gesyncten Tabellen, auch wenn unten nicht jedes Mal wiederholt):**
> `updated_at timestamptz NOT NULL DEFAULT now()` + Auto-Update-Trigger — PowerSync braucht das
> für Last-Write-Wins (siehe Abschnitt „Conflict Resolution"). Die frühere Version zeigte
> `updated_at` nur bei `tasks`/`visions`; das war ein Fehler.

### Identity & Access

```sql
-- Managed by Supabase Auth, but we extend with profiles
profiles (
  id              uuid PK references auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  display_name    text,
  avatar_url      text,
  locale          text DEFAULT 'en',          -- 'en' | 'de'
  timezone        text DEFAULT 'Europe/Berlin',
  role            text DEFAULT 'user',         -- 'user' | 'admin'
  onboarded_at    timestamptz,
  created_at      timestamptz DEFAULT now()
)

workspaces (
  id              uuid PK DEFAULT gen_random_uuid(),
  type            text NOT NULL,               -- 'solo' | 'duo'
  name            text NOT NULL,
  emoji           text,
  owner_id        uuid NOT NULL references profiles(id),
  plan            text DEFAULT 'free',         -- 'free' | 'pro' | 'duo'
  stripe_customer_id text,
  stripe_subscription_id text,
  trial_ends_at   timestamptz,
  created_at      timestamptz DEFAULT now()
)

workspace_members (
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id) ON DELETE CASCADE,
  role            text DEFAULT 'member',       -- 'owner' | 'member'
  joined_at       timestamptz DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
)

workspace_invites (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  email           text NOT NULL,
  invited_by      uuid NOT NULL references profiles(id),
  token           text NOT NULL UNIQUE,
  expires_at      timestamptz NOT NULL,
  accepted_at     timestamptz
)
```

### Vision Layer

```sql
visions (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  horizon         text NOT NULL,               -- '1y' | '3y' | '5y' | 'custom'
  custom_horizon  text,
  image_url       text,
  status          text DEFAULT 'active',       -- 'active' | 'paused' | 'achieved'
  future_self_statement text,
  conviction_score int DEFAULT 0,              -- 0-100
  conviction_updated_at timestamptz,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)

vision_values (
  vision_id       uuid NOT NULL references visions(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE, -- denormalisiert für PowerSync (Sync Rules erlauben keine Subqueries)
  value           text NOT NULL,
  PRIMARY KEY (vision_id, value)
)

annual_letters (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  vision_id       uuid references visions(id) ON DELETE CASCADE,
  year            int NOT NULL,
  content         text NOT NULL,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now()
)
```

### Goals & Projects

```sql
goals (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  vision_id       uuid references visions(id) ON DELETE SET NULL,
  area_id         uuid references areas(id) ON DELETE SET NULL,
  title           text NOT NULL,
  why_statement   text,
  conviction_score int DEFAULT 0,
  quarter         text NOT NULL,               -- 'Q1-2026'
  deadline        date,
  status          text DEFAULT 'on_track',     -- 'on_track' | 'behind' | 'achieved' | 'archived'
  progress_pct    int DEFAULT 0,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
)

key_results (
  id              uuid PK,
  goal_id         uuid NOT NULL references goals(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE, -- denormalisiert für PowerSync
  title           text NOT NULL,
  target_value    numeric,
  current_value   numeric DEFAULT 0,
  unit            text,                        -- '€', 'kg', '%', 'count'
  position        int DEFAULT 0,
  achieved_at     timestamptz
)

projects (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  goal_id         uuid references goals(id) ON DELETE SET NULL,
  area_id         uuid references areas(id) ON DELETE SET NULL,
  title           text NOT NULL,
  description     text,
  status          text DEFAULT 'planning',     -- 'planning' | 'active' | 'paused' | 'completed'
  is_legacy       boolean DEFAULT false,
  deadline        date,
  progress_pct    int DEFAULT 0,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
)

project_kanban_columns (
  id              uuid PK,
  project_id      uuid NOT NULL references projects(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE, -- denormalisiert für PowerSync
  title           text NOT NULL,
  position        int NOT NULL
)

areas (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  name            text NOT NULL,
  color           text NOT NULL,
  emoji           text,
  position        int DEFAULT 0
)
```

### Execution Layer

```sql
tasks (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  project_id      uuid references projects(id) ON DELETE SET NULL,
  parent_task_id  uuid references tasks(id) ON DELETE CASCADE,
  area_id         uuid references areas(id) ON DELETE SET NULL,
  kanban_column_id uuid references project_kanban_columns(id) ON DELETE SET NULL,
  title           text NOT NULL,
  description     text,
  priority        text DEFAULT 'medium',       -- 'high' | 'medium' | 'low'
  energy          text DEFAULT 'medium',       -- 'high' | 'medium' | 'low'
  tags            text[] DEFAULT '{}',         -- freie Tags (Notion-like Properties); GIN-Index unten
  scheduled_for   date,
  deadline        date,
  estimated_minutes int,
  is_obt          boolean DEFAULT false,       -- One Big Thing for the day
  status          text DEFAULT 'todo',         -- 'todo' | 'in_progress' | 'review' | 'done' | 'someday'
  completed_at    timestamptz,
  completed_by    uuid references profiles(id),
  recurrence      jsonb,                       -- {frequency, interval, days_of_week, ...}
  position        int DEFAULT 0,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)

task_assignees (
  task_id         uuid NOT NULL references tasks(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE, -- denormalisiert für PowerSync
  is_co_owner     boolean DEFAULT false,       -- 50% XP split
  PRIMARY KEY (task_id, user_id)
)

habits (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  area_id         uuid references areas(id) ON DELETE SET NULL,
  emoji           text NOT NULL,
  title           text NOT NULL,
  identity_statement text NOT NULL,            -- "I am someone who..."
  frequency_type  text NOT NULL,               -- 'daily' | 'x_per_week' | 'specific_days' | 'weekly'
  frequency_config jsonb NOT NULL,             -- {target_per_week} | {days: ['MO','WE','FR']}
  reminder_time   time,
  current_streak  int DEFAULT 0,
  longest_streak  int DEFAULT 0,
  shield_used_at  date,
  archived_at     timestamptz,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
)

habit_logs (
  id              uuid PK,
  habit_id        uuid NOT NULL references habits(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE, -- denormalisiert; Logs gehören in den Workspace-Bucket (Duo-Partner sieht Habit-Fortschritt)
  user_id         uuid NOT NULL references profiles(id),
  logged_for      date NOT NULL,
  logged_at       timestamptz DEFAULT now(),
  note            text,
  UNIQUE (habit_id, user_id, logged_for)
)

focus_sessions (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),
  task_id         uuid references tasks(id) ON DELETE SET NULL,
  started_at      timestamptz NOT NULL,
  ended_at        timestamptz,
  planned_minutes int NOT NULL,
  actual_minutes  int,
  pomodoros_completed int DEFAULT 0,
  focus_score     int,                          -- 0-100
  notes           text,
  ambient_sound   text
)
```

### Reflection Layer

```sql
inbox_items (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  content         text NOT NULL,
  status          text DEFAULT 'pending',      -- 'pending' | 'processed' | 'discarded'
  processed_into  text,                        -- 'task' | 'someday' | 'knowledge' | 'done'
  processed_into_id uuid,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now()
)

journal_entries (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),  -- always private to user, even in duo
  entry_date      date NOT NULL,
  daily_wins      jsonb,                        -- ["win1", "win2", "win3"]
  long_form       text,
  mood            text,
  tags            text[],
  created_at      timestamptz DEFAULT now()
)

morning_rituals (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),
  ritual_date     date NOT NULL,
  energy_level    int CHECK (energy_level BETWEEN 1 AND 5),  -- 1-5 (UI-Standard; war inkonsistent 1-10 vs. 1-5 in Phase 19)
  mood_emoji      text,
  obt_id          uuid references tasks(id),
  intentions      text[],                       -- 3 intentions
  affirmation     text,
  completed_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, ritual_date)
)

evening_rituals (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),
  ritual_date     date NOT NULL,
  best_moment     text,
  what_learned    text,
  intentions_met  jsonb,                        -- {intention: bool}
  tomorrow_obt    text,
  completed_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, ritual_date)
)

ceo_reviews (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),
  week_starting   date NOT NULL,
  wins            jsonb,                        -- ["win1", "win2", "win3"]
  what_didnt_work text,
  energy_avg      int,
  energy_notes    text,
  goal_check      jsonb,                        -- [{goal_id, status, note}]
  intentions_review jsonb,
  top_3_next_week jsonb,
  commitment      text,
  completed_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, week_starting)
)
```

### Knowledge & Insights

```sql
knowledge_entries (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  title           text NOT NULL,
  content         text NOT NULL,                -- markdown
  category        text NOT NULL,                -- 'book' | 'insight' | 'idea' | 'quote' | 'resource' | custom
  source          text,
  goal_id         uuid references goals(id) ON DELETE SET NULL,
  project_id      uuid references projects(id) ON DELETE SET NULL,
  created_by      uuid NOT NULL references profiles(id),
  created_at      timestamptz DEFAULT now()
)

knowledge_tags (
  knowledge_id    uuid NOT NULL references knowledge_entries(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE, -- denormalisiert für PowerSync
  tag             text NOT NULL,
  PRIMARY KEY (knowledge_id, tag)
)
```

### Wellbeing

```sql
energy_logs (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id),
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  log_date        date NOT NULL,
  energy_level    int NOT NULL CHECK (energy_level BETWEEN 1 AND 5),  -- 1-5, konsistent mit morning_rituals
  notes           text,
  UNIQUE (user_id, log_date)
)

sleep_logs (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id),
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  log_date        date NOT NULL,
  duration_minutes int,
  quality         int,                          -- 1-5
  UNIQUE (user_id, log_date)
)

emotion_logs (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id),
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  logged_at       timestamptz DEFAULT now(),
  primary_emotion text NOT NULL,                -- Plutchik 8: joy, trust, fear, surprise, sadness, disgust, anger, anticipation
  intensity       int NOT NULL,                 -- 1-10
  trigger_note    text
)
```

### Finance (Optional Module)

```sql
financial_accounts (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  owner_id        uuid NOT NULL references profiles(id),
  type            text NOT NULL,                -- 'checking' | 'savings' | 'investment' | 'debt'
  scope           text NOT NULL,                -- 'personal' | 'business'
  visibility      text NOT NULL DEFAULT 'private', -- 'shared' | 'private' (aus phase-09-EXPANDED übernommen: private Konten sieht der Duo-Partner NICHT)
  name            text NOT NULL,
  current_balance numeric DEFAULT 0,
  currency        text DEFAULT 'EUR'
)

financial_transactions (
  id              uuid PK,
  account_id      uuid NOT NULL references financial_accounts(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE, -- denormalisiert für PowerSync
  visibility      text NOT NULL DEFAULT 'private', -- vom Konto denormalisiert (Trigger), für JOIN-freie Sync Rules
  transaction_date date NOT NULL,
  amount          numeric NOT NULL,             -- negative = expense
  category        text NOT NULL,                -- 'rent' | 'food' | 'income' | etc.
  description     text,
  recurrence      jsonb
)
```

### Calendar

```sql
calendar_events (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),
  task_id         uuid references tasks(id) ON DELETE SET NULL,
  title           text NOT NULL,
  description     text,
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  is_all_day      boolean DEFAULT false,
  is_deep_work    boolean DEFAULT false,
  area_id         uuid references areas(id),
  recurrence      jsonb,
  external_provider text,                       -- 'google' | 'outlook' | 'apple' | null
  external_id     text
)

calendar_integrations (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id),
  provider        text NOT NULL,                -- 'google' | 'outlook' | 'apple'
  access_token    text,                         -- encrypted at rest
  refresh_token   text,                         -- encrypted at rest
  expires_at      timestamptz,
  last_sync_at    timestamptz,
  sync_direction  text DEFAULT 'bidirectional', -- 'bidirectional' | 'read_only'
  UNIQUE (user_id, provider)
)
```

### XP & Gamification

```sql
xp_events (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),
  source_type     text NOT NULL,                -- 'task' | 'habit' | 'focus' | 'ritual' | 'review' | 'combo'
  source_id       uuid,
  amount          int NOT NULL,
  multiplier      numeric DEFAULT 1.0,
  combo_type      text,
  occurred_at     timestamptz DEFAULT now()
)

xp_state (
  -- XP ist global pro User (eine Identität über alle Workspaces) — daher KEIN
  -- workspace_id hier. Die frühere workspace_id-Spalte war widersprüchlich
  -- (PK nur user_id, aber NOT NULL workspace_id → undefiniert bei 2 Workspaces).
  user_id         uuid PK references profiles(id) ON DELETE CASCADE,
  legacy_xp       bigint DEFAULT 0,
  current_level   int DEFAULT 1,
  current_rank    text DEFAULT 'seeker',
  prestige        int DEFAULT 0,
  momentum        int DEFAULT 0,
  last_activity_at timestamptz
)

badges (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id),
  badge_type      text NOT NULL,
  earned_at       timestamptz DEFAULT now(),
  UNIQUE (user_id, badge_type)
)
```

### Notifications

```sql
notifications (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id),
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  type            text NOT NULL,                -- 'task_due' | 'habit_reminder' | 'streak_warning' | 'duo_activity' | etc.
  title           text NOT NULL,
  body            text,
  link            text,
  read_at         timestamptz,
  created_at      timestamptz DEFAULT now()
)

notification_preferences (
  user_id         uuid PK references profiles(id) ON DELETE CASCADE,
  task_reminders  boolean DEFAULT true,
  habit_reminders boolean DEFAULT true,
  streak_warnings boolean DEFAULT true,
  duo_activity    boolean DEFAULT true,
  rituals         boolean DEFAULT true,
  weekly_digest   boolean DEFAULT true,
  dnd_start_time  time,
  dnd_end_time    time
)
```

### File Attachments

```sql
attachments (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  uploader_id     uuid NOT NULL references profiles(id),
  storage_path    text NOT NULL,                -- Supabase Storage path
  filename        text NOT NULL,
  mime_type       text NOT NULL,
  size_bytes      bigint NOT NULL,             -- bigint: int4 überläuft bei >2GB
  attachable_type text NOT NULL,                -- 'task' | 'project' | 'goal' | 'journal' | 'knowledge' | 'vision'
  attachable_id   uuid NOT NULL,
  created_at      timestamptz DEFAULT now()
)
```

### Audit & Activity

```sql
activity_log (
  id              uuid PK,
  workspace_id    uuid NOT NULL references workspaces(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL references profiles(id),
  entity_type     text NOT NULL,
  entity_id       uuid NOT NULL,
  action          text NOT NULL,                -- 'created' | 'updated' | 'completed' | 'deleted'
  changes         jsonb,
  occurred_at     timestamptz DEFAULT now()
)
```

## Row Level Security (RLS) Policies

**Every table with `workspace_id` has RLS enabled.** No exceptions.

### Pattern: Helper Function

> ⚠️ **Nicht im `auth`-Schema anlegen!** Supabase sperrt seit April 2025 eigene Objekte in
> `auth`/`storage`/`realtime`. Eigene Helper gehören in ein privates Schema (hier: `app`).

```sql
CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.user_workspaces() RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
$$;

-- KRITISCH (siehe security-tests.md Befund): ohne EXECUTE-Grant schlagen alle
-- RLS-Policies fehl, die diese Funktion aufrufen.
REVOKE ALL ON FUNCTION app.user_workspaces() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.user_workspaces() TO authenticated;
```

Alle Policy-Beispiele unten nutzen entsprechend `app.user_workspaces()`.

### Pattern: Read

```sql
CREATE POLICY "members can read"
ON tasks FOR SELECT
USING (workspace_id IN (SELECT app.user_workspaces()));
```

### Pattern: Write

```sql
CREATE POLICY "members can insert"
ON tasks FOR INSERT
WITH CHECK (
  workspace_id IN (SELECT app.user_workspaces())
  AND created_by = auth.uid()
);

CREATE POLICY "members can update"
ON tasks FOR UPDATE
USING (workspace_id IN (SELECT app.user_workspaces()))
WITH CHECK (workspace_id IN (SELECT app.user_workspaces()));

CREATE POLICY "members can delete"
ON tasks FOR DELETE
USING (workspace_id IN (SELECT app.user_workspaces()));
```

### Special Policies

- **Journal entries are private even in Duo workspaces.** Reading restricted to `user_id = auth.uid()`.
- **Energy/Sleep/Emotion logs are private.** Same as above.
- **Workspaces.update** restricted to `owner_id = auth.uid()` for plan changes.
- **Workspace_members.delete** restricted to owner OR self-removal.
- **Calendar_integrations** restricted to `user_id = auth.uid()` only (never visible to duo partner).
- **Stripe IDs** never exposed to client; only readable by service role.

## Indexes

Performance-critical indexes that must exist from the start:

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
CREATE INDEX idx_tasks_tags ON tasks USING GIN (tags);  -- Tag-Filterung
```

## Migration Philosophy

1. **One migration = one purpose.** Schema change, data migration, or RLS policy. Not all three.
2. **Filename:** `YYYYMMDDHHMMSS_descriptive_name.sql` (Supabase CLI convention).
3. **Reversibility:** Every migration has a documented rollback strategy in a comment.
4. **No editing applied migrations.** New migration corrects, never amends.
5. **Type generation runs on every push.** `supabase gen types typescript --local` updates `src/types/database.types.ts`.
6. **RLS policies live in migrations**, not separately. Schema and security ship together.
7. **Seed data for development** lives in `supabase/seed.sql`. Never in migrations.

## Soft Delete vs Hard Delete

**Hard delete by default.** ON DELETE CASCADE wherever appropriate. DSGVO right-to-erasure simpler.

Exceptions where soft delete makes sense (use `archived_at timestamptz`):

- Habits (preserve historical streak data even if user "deletes")
- Goals (review history references them)
- Visions (annual letter history references them)

For these, "delete" in UI = set `archived_at = now()`. Filter `WHERE archived_at IS NULL` everywhere.

## What's NOT in the Schema (Yet)

These are deliberately deferred to later stages:

- **Team workspaces with permissions** (Stage 3 if at all)
- **Public profiles or social features** (never)
- **OAuth provider connections beyond auth** (Stage 2-3 for calendar)
- **Webhooks for users** (Stage 3 power-user feature)
- **API tokens for users** (Stage 3 if there's a Zapier/Make integration story)
- **Audit log for admin** (Stage 3 separate from activity_log)
- **Email broadcasts table** (Resend handles, not stored in DB)

## What This Schema Enables That the Master Prompt Did Not

1. **Real Duo workspaces** with shared vision/goals/tasks while keeping journal/health private.
2. **Multi-tenancy enforced at DB level** — RLS prevents data leaks even with bugs in app code.
3. **Stripe-driven plan limits** queryable directly (`workspaces.plan`).
4. **DSGVO-compliant deletion cascades** automatically.
5. **Activity log per workspace** for audit and "what changed today" feed.
6. **Cross-device sync via PowerSync** — every client maintains a SQLite mirror.
7. **True offline-first** — all reads from local SQLite, writes queued.

---

## PowerSync Sync Rules

PowerSync streams Postgres rows into SQLite on every client. Rules defined in `powersync/sync-rules.yaml` determine which rows go to which clients.

### Bucket Strategy

A "bucket" is a named slice of data that may be downloaded to a client. The user's effective dataset is the union of buckets they have access to.

> ⚠️ **Wichtige Korrektur (Audit 2026-06-10):** PowerSync **Sync Rules erlauben keine Subqueries
> und keine JOINs in Data Queries** — jede Data Query muss den Bucket-Parameter direkt auf eine
> Spalte matchen. Die frühere Version dieses Dokuments nutzte `IN (SELECT ...)`-Subqueries, die
> beim Deploy fehlschlagen. Lösung: `workspace_id` ist jetzt auf alle Kindtabellen denormalisiert
> (vision_values, key_results, project_kanban_columns, task_assignees, knowledge_tags,
> financial_transactions, habit_logs).
>
> **Alternative für Phase 09 evaluieren:** PowerSync **Sync Streams** (Beta, offiziell für neue
> Projekte empfohlen) unterstützen Subqueries/JOINs/CTEs und würden die Denormalisierung
> überflüssig machen. Entscheidung beim Setup treffen und hier dokumentieren.

```yaml
# powersync/sync-rules.yaml

bucket_definitions:
  # Bucket 1: Workspace-shared data (visible to all members of a workspace)
  workspace_shared:
    # Parameter Query: direkt auf workspace_members — kein Subquery nötig
    parameters: |
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = request.user_id()
    data:
      - SELECT * FROM workspaces WHERE id = bucket.workspace_id
      - SELECT * FROM workspace_members WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM areas WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM visions WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM vision_values WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM annual_letters WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM goals WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM key_results WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM projects WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM project_kanban_columns WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM tasks WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM task_assignees WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM habits WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM habit_logs WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM inbox_items WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM knowledge_entries WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM knowledge_tags WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM calendar_events WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM financial_accounts WHERE workspace_id = bucket.workspace_id AND visibility = 'shared'
      - SELECT * FROM financial_transactions WHERE workspace_id = bucket.workspace_id AND visibility = 'shared'
      # Hinweis: visibility auch auf financial_transactions denormalisieren (Trigger vom Konto),
      # damit der Filter ohne JOIN möglich ist. Private Konten/Transaktionen syncen über einen
      # eigenen user-privaten Bucket (user_private_finance, parameters: owner_id = request.user_id()).
      - SELECT * FROM activity_log WHERE workspace_id = bucket.workspace_id
      - SELECT * FROM attachments WHERE workspace_id = bucket.workspace_id

  # Bucket 2: User-private data (always private, even in Duo workspaces)
  user_