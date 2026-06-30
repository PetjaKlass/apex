'use client';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';
import { SignIn } from './SignIn';
import { AppShell } from './AppShell';
import { Onboarding } from './Onboarding';

function Splash() {
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
}

export function AppGate() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // WICHTIG: nur an die User-ID koppeln, NICHT an das Session-Objekt.
  // Supabase erneuert das Token bei Tab-Fokus → neues Session-Objekt → früher wurde
  // onboarded auf null gesetzt → Splash → Onboarding unmountet → Reset auf Schritt 1.
  // Mit der stabilen uid läuft der Effekt nur bei echtem Login/Logout.
  const uid = session?.user?.id ?? null;
  useEffect(() => {
    if (!uid) {
      setOnboarded(null);
      return;
    }
    let cancelled = false;
    supabase
      .from('profiles')
      .select('onboarded_at')
      .eq('id', uid)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setOnboarded(!!data?.onboarded_at);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (loading || (uid && onboarded === null)) return <Splash />;
  if (!session) return <SignIn />;
  if (!onboarded) return <Onboarding userId={session.user.id} onDone={() => setOnboarded(true)} />;
  return <AppShell userId={session.user.id} />;
}
