'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

// Untypisierter Zugriff für Tabellen außerhalb der bisherigen @apex/types (Phase-08).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as unknown as { from: (table: string) => any };

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  is_obt: boolean;
  scheduled_for: string | null;
  estimated_minutes: number | null;
  tags: string[] | null;
};
export type Habit = { id: string; title: string; identity_statement: string; icon: string | null };
export type Goal = { id: string; title: string; progress_pct: number | null };

export type DashboardData = {
  obt: Task | null;
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  habitLogIds: Set<string>;
  journalDone: boolean;
  tasksDone: number;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export function useDashboard(workspaceId: string | undefined, userId: string | undefined) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!workspaceId || !userId) return;
    const today = todayISO();
    const [tasksRes, habitsRes, goalsRes, logsRes, journalRes] = await Promise.all([
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
      db
        .from('goals')
        .select('id,title,progress_pct')
        .eq('workspace_id', workspaceId)
        .is('archived_at', null)
        .order('created_at', { ascending: true })
        .limit(4),
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
      goals: (goalsRes.data ?? []) as Goal[],
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

  const toggleTask = useCallback(
    async (id: string, doneNow: boolean) => {
      setData((p) =>
        p
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === id ? { ...t, status: doneNow ? 'done' : 'todo' } : t
              ),
              obt:
                p.obt && p.obt.id === id ? { ...p.obt, status: doneNow ? 'done' : 'todo' } : p.obt,
              tasksDone: Math.max(0, p.tasksDone + (doneNow ? 1 : -1)),
            }
          : p
      );
      await db
        .from('tasks')
        .update(
          doneNow
            ? { status: 'done', completed_at: new Date().toISOString() }
            : { status: 'todo', completed_at: null }
        )
        .eq('id', id);
      void load();
    },
    [load]
  );

  const toggleHabit = useCallback(
    async (id: string, doneNow: boolean) => {
      if (!userId) return;
      setData((p) => {
        if (!p) return p;
        const s = new Set(p.habitLogIds);
        if (doneNow) s.add(id);
        else s.delete(id);
        return { ...p, habitLogIds: s };
      });
      const today = todayISO();
      if (doneNow)
        await db
          .from('habit_logs')
          .insert({ habit_id: id, user_id: userId, workspace_id: workspaceId, logged_for: today });
      else
        await db
          .from('habit_logs')
          .delete()
          .eq('habit_id', id)
          .eq('user_id', userId)
          .eq('logged_for', today);
      void load();
    },
    [load, userId, workspaceId]
  );

  return { data, loading, reload: load, toggleTask, toggleHabit };
}
