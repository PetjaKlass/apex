'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';

const Brand = () => (
  <div className="brand">
    <div className="brand-mark">
      <Icon id="i-peak" s={17} />
    </div>
    <span className="brand-name">APEX</span>
  </div>
);

export function SignIn() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setErr(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) setErr(error.message);
      else if (!data.session) setConfirm(true);
    }
    setBusy(false);
  };

  if (confirm)
    return (
      <div className="auth-wrap">
        <div className="auth-card card">
          <Brand />
          <h1 className="auth-h1">Fast geschafft.</h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Prüfe dein Postfach — bestätige deine E-Mail, um fortzufahren.
          </p>
        </div>
      </div>
    );

  const upDisabled = mode === 'up' && !consent;

  return (
    <div className="auth-wrap">
      <form className="auth-card card" onSubmit={submit}>
        <Brand />
        <h1 className="auth-h1">{mode === 'in' ? 'Willkommen zurück.' : 'Konto erstellen.'}</h1>
        <label className="auth-label" htmlFor="email">
          E-Mail
        </label>
        <input
          id="email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="du@beispiel.de"
        />
        <label className="auth-label" htmlFor="pw">
          Passwort
        </label>
        <input
          id="pw"
          className="auth-input"
          type="password"
          autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === 'up' && (
          <>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
              Mindestens 8 Zeichen.
            </p>
            <label className="ob-check" style={{ marginTop: 16, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>Ich akzeptiere die Nutzungsbedingungen und die Datenschutzerklärung.</span>
            </label>
          </>
        )}
        {err && <p className="auth-err">{err}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy || upDisabled}>
          {busy ? '…' : mode === 'in' ? 'Anmelden' : 'Konto erstellen'}
        </button>
        <button
          type="button"
          className="ob-skip"
          style={{ marginTop: 16 }}
          onClick={() => {
            setMode((m) => (m === 'in' ? 'up' : 'in'));
            setErr('');
          }}
        >
          {mode === 'in' ? 'Noch kein Konto? Registrieren' : 'Schon ein Konto? Anmelden'}
        </button>
      </form>
    </div>
  );
}
