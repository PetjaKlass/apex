/**
 * Dashboard-Daten — liest DIREKT aus Supabase (PowerSync-Sync ist Stage-1 deferred).
 * RLS schützt; wir filtern zusätzlich auf den aktiven Workspace. Bei aktivem Sync später
 * wird dieselbe Form aus der lokalen SQLite bedient (ein Tausch an einer Stelle).
 */
import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

const db = supabase as unknown as SupabaseClient;

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  is_obt: boolean;
  scheduled_for: string | null;
  estimated_minutes: number | null;
  tags: string[];
};
export type Habit = { id: string; title: string; identity_statement: string; icon: string | null };

export type DashboardData = {
  obt: Task | null;
  tasks: Task[];
  habits: Habit[];
  habitLogIds: Set<string>;
  journalDone: boolean;
  tasksDone: number;
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDashboard(workspaceId: string | undefined, userId: string | undefined) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!workspaceId || !userId) return;
    const today = todayISO();

    const [tasksRes, habitsRes, logsRes, journalRes] = await Promise.all([
      db
        .from('tasks')
        .select('id,title,status,priority,is_obt,scheduled_for,estimated_minutes,tags')
        .eq('workspace_id', workspaceId)
        .or(`scheduled_for.eq.${today},is_obt.eq.true`)
        .order('is_obt', { ascending: false })
        .order('priority', { ascending: true }),
      db
        .from('habits')
        .select('id,title,identity_statement,icon')
        .eq('workspace_id', workspaceId)
        .is('archived_at', null)
        .limit(5),
      db.from('habit_logs').select('habit_id').eq('user_id', userId).eq('logged_for', today),
      db
        .from('journal_entries')
        .select('id')
        .eq('user_id', userId)
        .eq('entry_date', today)
        .limit(1),
    ]);

    const allTasks = (tasksRes.data ?? []) as Task[];
    const obt = allTasks.find((t) => t.is_obt) ?? null;
    const tasks = allTasks.filter((t) => !t.is_obt && t.status !== 'done').slice(0, 5);

    setData({
      obt,
      tasks,
      habits: (habitsRes.data ?? []) as Habit[],
      habitLogIds: new Set((logsRes.data ?? []).map((l: { habit_id: string }) => l.habit_id)),
      journalDone: (journalRes.data?.length ?? 0) > 0,
      tasksDone: allTasks.filter((t) => t.status === 'done').length,
    });
    setLoading(false);
  }, [workspaceId, userId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  return { data, loading, reload: load };
}
