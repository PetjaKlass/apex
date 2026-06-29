'use client';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';
import { SignIn } from './SignIn';
import { AppShell } from './AppShell';

export function AppGate() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="app-splash">
        <div className="brand">
          <div className="brand-mark">
            <Icon id="i-peak" s={20} />
          </div>
          <span className="brand-name">APEX</span>
        </div>
      </div>
    );
  if (!session) return <SignIn />;
  return <AppShell userId={session.user.id} />;
}
