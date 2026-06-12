'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

type Mode = 'sign-in' | 'sign-up' | 'reset';

/** Funktionale Auth-Formulare (Marketing, isoliert getestet — Handoff: Phase 13 / ADR 0013). */
export function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations('marketing.auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg({ kind: 'ok', text: t('successSignIn') });
      } else if (mode === 'sign-up') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({ kind: 'ok', text: data.session ? t('successSignIn') : t('successConfirm') });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMsg({ kind: 'ok', text: t('successReset') });
      }
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => void submit(e)}>
      <label className="block" htmlFor={`${mode}-email`}>
        <span className="text-2xs text-fg-2 mb-1.5 block font-semibold">{t('email')}</span>
        <input
          id={`${mode}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-border bg-subtle text-fg-1 shadow-edge focus-visible:border-accent h-[42px] w-full rounded border px-4 text-sm outline-none focus-visible:shadow-[0_0_0_4px_var(--accent-glow)]"
        />
      </label>
      {mode !== 'reset' && (
        <label className="block" htmlFor={`${mode}-password`}>
          <span className="text-2xs text-fg-2 mb-1.5 block font-semibold">{t('password')}</span>
          <input
            id={`${mode}-password`}
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-border bg-subtle text-fg-1 shadow-edge focus-visible:border-accent h-[42px] w-full rounded border px-4 text-sm outline-none focus-visible:shadow-[0_0_0_4px_var(--accent-glow)]"
          />
        </label>
      )}
      <button
        type="submit"
        disabled={busy}
        className="bg-accent text-accent-on shadow-card-edge mt-2 w-full rounded-full px-6 py-3 text-sm font-semibold hover:brightness-105 disabled:opacity-60"
      >
        {mode === 'sign-in' ? t('signIn') : mode === 'sign-up' ? t('signUp') : t('reset')}
      </button>
      {msg && (
        <p
          role={msg.kind === 'err' ? 'alert' : 'status'}
          className={`shadow-edge rounded-sm px-3 py-2 text-xs ${msg.kind === 'err' ? 'bg-subtle text-danger-fg' : 'bg-subtle text-success-fg'}`}
        >
          {msg.text}
        </p>
      )}
    </form>
  );
}
