'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useDashboard } from '@/lib/useDashboard';
import { Dashboard } from './Dashboard';

export function DashboardLive({ userId }: { userId: string }) {
  const [wsId, setWsId] = useState<string | undefined>();

  useEffect(() => {
    supabase
      .from('workspaces')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .then(({ data }) => setWsId(data?.[0]?.id));
  }, []);

  const { data, loading, toggleTask, toggleHabit } = useDashboard(wsId, userId);
  return (
    <Dashboard
      data={data}
      loading={loading}
      onToggleTask={(id, done) => void toggleTask(id, done)}
      onToggleHabit={(id, done) => void toggleHabit(id, done)}
    />
  );
}
