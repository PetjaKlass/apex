/**
 * PowerSync AppSchema — lokale SQLite-Replik (Phase 09b).
 * Kern-Tabellen für Phasen 10–15; weitere folgen je Feature-Phase.
 * Spalten-Typen: PowerSync kennt text/integer/real — Datumswerte als ISO-Text,
 * jsonb als Text (JSON.stringify), bool als integer 0/1 (Konvention dokumentiert).
 */
import { column, Schema, Table } from '@powersync/common';

const tasks = new Table(
  {
    workspace_id: column.text,
    project_id: column.text,
    parent_task_id: column.text,
    area_id: column.text,
    title: column.text,
    description: column.text,
    priority: column.text,
    energy: column.text,
    tags: column.text, // JSON-Array als Text
    scheduled_for: column.text,
    deadline: column.text,
    estimated_minutes: column.integer,
    is_obt: column.integer,
    status: column.text,
    completed_at: column.text,
    completed_by: column.text,
    recurrence: column.text,
    position: column.integer,
    created_by: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      ws_status: ['workspace_id', 'status'],
      scheduled: ['workspace_id', 'scheduled_for'],
    },
  }
);

const areas = new Table({
  workspace_id: column.text,
  name: column.text,
  color: column.text,
  icon: column.text,
  position: column.integer,
  created_at: column.text,
  updated_at: column.text,
});

const goals = new Table({
  workspace_id: column.text,
  vision_id: column.text,
  area_id: column.text,
  title: column.text,
  why_statement: column.text,
  conviction_score: column.integer,
  quarter: column.text,
  deadline: column.text,
  status: column.text,
  progress_pct: column.integer,
  archived_at: column.text,
  created_by: column.text,
  created_at: column.text,
  updated_at: column.text,
});

const projects = new Table({
  workspace_id: column.text,
  goal_id: column.text,
  area_id: column.text,
  title: column.text,
  description: column.text,
  status: column.text,
  is_legacy: column.integer,
  deadline: column.text,
  progress_pct: column.integer,
  created_by: column.text,
  created_at: column.text,
  updated_at: column.text,
});

const habits = new Table({
  workspace_id: column.text,
  area_id: column.text,
  icon: column.text,
  title: column.text,
  identity_statement: column.text,
  frequency_type: column.text,
  frequency_config: column.text,
  reminder_time: column.text,
  current_streak: column.integer,
  longest_streak: column.integer,
  shield_used_at: column.text,
  archived_at: column.text,
  created_by: column.text,
  created_at: column.text,
  updated_at: column.text,
});

const habit_logs = new Table(
  {
    habit_id: column.text,
    workspace_id: column.text,
    user_id: column.text,
    logged_for: column.text,
    logged_at: column.text,
    note: column.text,
  },
  { indexes: { by_habit: ['habit_id', 'logged_for'] } }
);

const journal_entries = new Table({
  workspace_id: column.text,
  user_id: column.text,
  entry_date: column.text,
  daily_wins: column.text,
  long_form: column.text,
  mood: column.text,
  tags: column.text,
  created_at: column.text,
  updated_at: column.text,
});

export const AppSchema = new Schema({
  tasks,
  areas,
  goals,
  projects,
  habits,
  habit_logs,
  journal_entries,
});
export type DbTable = keyof typeof AppSchema.props extends never ? string : string;
