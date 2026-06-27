import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Card, Skeleton, useToast } from '@apex/ui';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { supabase } from '@/lib/supabase/client';
import { useWorkspace } from '@/lib/workspace';
import { useDashboard } from '@/lib/data/dashboard';
import { calcMomentum } from '@/lib/momentum/calculator';
import { CommandPalette } from '@/components/CommandPalette';
import { Greeting } from '@/components/dashboard/Greeting';
import { JournalPromptWidget } from '@/components/dashboard/JournalPromptWidget';
import { MomentumOrb } from '@/components/dashboard/MomentumOrb';
import { OBTHero } from '@/components/dashboard/OBTHero';
import { HabitCard } from '@/components/habits/HabitCard';
import { TaskRow } from '@/components/tasks/TaskRow';

const db = supabase as unknown as SupabaseClient;

export default function Dashboard() {
  const t = useT();
  const router = useRouter();
  const toast = useToast();
  const { session, profile } = useAuth();
  const { active, loading: wsLoading } = useWorkspace();
  const { data, loading, reload } = useDashboard(active?.id, session?.user.id);
  const { width } = useWindowDimensions();
  const twoCol = width >= 900;
  const [busy, setBusy] = useState(false);

  const momentum = useMemo(
    () =>
      calcMomentum({
        tasksDone: data?.tasksDone ?? 0,
        habitsLogged: data?.habitLogIds.size ?? 0,
        obtDone: data?.obt?.status === 'done',
      }),
    [data]
  );

  const completeObt = async () => {
    if (!data?.obt || busy) return;
    setBusy(true);
    await db
      .from('tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', data.obt.id);
    await reload();
    setBusy(false);
    toast.show({ type: 'xp', xp: 50, message: t('tasks.obt') });
  };

  const toggleTask = async (id: string, doneNow: boolean) => {
    await db
      .from('tasks')
      .update(
        doneNow
          ? { status: 'done', completed_at: new Date().toISOString() }
          : { status: 'todo', completed_at: null }
      )
      .eq('id', id);
    await reload();
    if (doneNow) toast.show({ type: 'xp', xp: 25, message: t('nav.tasks') });
  };

  const toggleHabit = async (id: string, doneNow: boolean) => {
    const today = new Date().toISOString().slice(0, 10);
    if (doneNow) {
      await db
        .from('habit_logs')
        .insert({ habit_id: id, user_id: session?.user.id, logged_for: today });
      toast.show({ type: 'xp', xp: 15, message: t('nav.habits') });
    } else {
      await db
        .from('habit_logs')
        .delete()
        .eq('habit_id', id)
        .eq('user_id', session?.user.id)
        .eq('logged_for', today);
    }
    await reload();
  };

  const addTask = async (title: string) => {
    if (!active || !session) return;
    await db.from('tasks').insert({
      workspace_id: active.id,
      title,
      scheduled_for: new Date().toISOString().slice(0, 10),
      priority: 'medium',
      created_by: session.user.id,
    });
    await reload();
    toast.show({ type: 'success', message: t('common.done') });
  };

  if (wsLoading || loading || !data) {
    return (
      <ScrollView contentContainerClassName="p-6 gap-4">
        <Skeleton.Text lines={1} width="40%" />
        <View style={{ height: 140 }}>
          <Skeleton.Card height={140} />
        </View>
        <View style={{ height: 120 }}>
          <Skeleton.Card height={120} />
        </View>
      </ScrollView>
    );
  }

  const HeroColumn = (
    <View className="flex-1 gap-4">
      <OBTHero
        task={data.obt}
        onComplete={() => void completeObt()}
        onPick={() => router.push('/tasks')}
      />

      <Card
        header={t('dashboard.todayTasks')}
        hint={t('dashboard.tasksLeft', { count: data.tasks.length })}
      >
        {data.tasks.length === 0 ? (
          <Text className="text-fg-3 py-4 text-sm">{t('dashboard.emptyTasks')}</Text>
        ) : (
          data.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={(id) => void toggleTask(id, task.status !== 'done')}
            />
          ))
        )}
      </Card>

      <Card
        header={t('dashboard.todayHabits')}
        hint={t('dashboard.habitsProgress', {
          done: data.habitLogIds.size,
          total: data.habits.length,
        })}
      >
        {data.habits.length === 0 ? (
          <Text className="text-fg-3 py-4 text-sm">{t('dashboard.emptyHabits')}</Text>
        ) : (
          <View className="gap-3">
            {data.habits.map((habit) => {
              const done = data.habitLogIds.has(habit.id);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  doneToday={done}
                  onToggle={(id) => void toggleHabit(id, !done)}
                />
              );
            })}
          </View>
        )}
      </Card>
    </View>
  );

  const SideColumn = (
    <View className="gap-4" style={twoCol ? { width: 340 } : undefined}>
      <Card header={t('dashboard.momentum')}>
        <MomentumOrb
          data={momentum}
          onPress={() => toast.show({ type: 'info', message: 'Score Card — Phase 25' })}
        />
      </Card>
      <JournalPromptWidget done={data.journalDone} />
    </View>
  );

  return (
    <>
      <ScrollView contentContainerClassName="p-6 pb-16">
        <Greeting name={profile?.display_name ?? '…'} />
        <View className={twoCol ? 'mt-8 flex-row gap-4' : 'mt-8 gap-4'}>
          {HeroColumn}
          {SideColumn}
        </View>
      </ScrollView>
      <CommandPalette onAddTask={(title) => void addTask(title)} />
    </>
  );
}
