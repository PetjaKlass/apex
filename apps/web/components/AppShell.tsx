'use client';
import { supabase } from '@/lib/supabase';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DashboardLive } from './DashboardLive';

export function AppShell({ userId }: { userId: string }) {
  return (
    <div className="app">
      <Sidebar active="dashboard" onSignOut={() => void supabase.auth.signOut()} />
      <div className="main">
        <Topbar title="Dashboard" />
        <main className="page">
          <div className="page-inner">
            <DashboardLive userId={userId} />
          </div>
        </main>
      </div>
    </div>
  );
}
